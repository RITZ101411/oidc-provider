import { generateKeyPair, exportJWK, importSPKI, importPKCS8 } from 'jose';
import { db } from '../db/index.js';
import { jwks } from '../db/schema.js';
import { eq, isNull, or, gt } from 'drizzle-orm';
import crypto from 'crypto';

/**
 * Generate a new RSA key pair and store it in the database.
 */
export async function generateJwk() {
  const { publicKey, privateKey } = await generateKeyPair('RS256', {
    extractable: true,
  });

  const kid = `key-${crypto.randomUUID().slice(0, 8)}`;

  const privateKeyPem = await exportKeyToPem(privateKey, 'private');
  const publicKeyPem = await exportKeyToPem(publicKey, 'public');

  await db.insert(jwks).values({
    kid,
    privateKey: privateKeyPem,
    publicKey: publicKeyPem,
    algorithm: 'RS256',
    active: true,
  });

  return kid;
}

/**
 * Get the currently active signing key.
 */
export async function getActiveKey() {
  const [key] = await db
    .select()
    .from(jwks)
    .where(eq(jwks.active, true))
    .limit(1);

  if (!key) return null;

  return {
    kid: key.kid,
    privateKey: await importPKCS8(key.privateKey, 'RS256'),
    algorithm: key.algorithm,
  };
}

/**
 * Get all valid public keys for the JWKS endpoint.
 * Returns active keys and expired keys that haven't passed their expiredAt date.
 */
export async function getPublicKeys() {
  const keys = await db
    .select()
    .from(jwks)
    .where(
      or(
        eq(jwks.active, true),
        gt(jwks.expiredAt, new Date())
      )
    );

  const jwkKeys = await Promise.all(
    keys.map(async (key) => {
      const publicKey = await importSPKI(key.publicKey, 'RS256');
      const jwk = await exportJWK(publicKey);
      return {
        ...jwk,
        kid: key.kid,
        alg: key.algorithm,
        use: 'sig',
      };
    })
  );

  return { keys: jwkKeys };
}

/**
 * Rotate keys: deactivate the current key and generate a new one.
 */
export async function rotateKeys() {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  await db
    .update(jwks)
    .set({
      active: false,
      expiredAt: thirtyDaysFromNow,
    })
    .where(eq(jwks.active, true));

  return generateJwk();
}

/**
 * Ensure at least one active key exists. If not, generate one.
 */
export async function ensureActiveKey() {
  const activeKey = await getActiveKey();
  if (!activeKey) {
    await generateJwk();
  }
}

async function exportKeyToPem(key: CryptoKey, type: 'public' | 'private'): Promise<string> {
  const exported = await crypto.subtle.exportKey(
    type === 'private' ? 'pkcs8' : 'spki',
    key
  );
  const base64 = Buffer.from(exported).toString('base64');
  const label = type === 'private' ? 'PRIVATE KEY' : 'PUBLIC KEY';
  return `-----BEGIN ${label}-----\n${base64.match(/.{1,64}/g)!.join('\n')}\n-----END ${label}-----`;
}
