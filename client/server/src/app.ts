import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import crypto from 'crypto';

const app = new Hono();

// --- Config ---
const PROVIDER_URL = process.env.PROVIDER_URL ?? 'http://localhost:3000/api/auth';
const PROVIDER_PUBLIC_URL = process.env.PROVIDER_PUBLIC_URL ?? PROVIDER_URL;
const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI ?? 'http://localhost:8080/callback';
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5174';

app.use('*', cors({ origin: FRONTEND_URL, credentials: true }));

// --- In-memory session store (demo only) ---
const sessions = new Map<string, { sub: string; email?: string; name?: string; accessToken: string }>();

// --- Start login flow ---
app.get('/login', (c) => {
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
  const state = crypto.randomBytes(16).toString('base64url');

  // Store verifier and state in cookies (httpOnly)
  setCookie(c, 'code_verifier', codeVerifier, { httpOnly: true, path: '/', sameSite: 'Lax', maxAge: 600 });
  setCookie(c, 'oauth_state', state, { httpOnly: true, path: '/', sameSite: 'Lax', maxAge: 600 });

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'openid profile email',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  return c.redirect(`${PROVIDER_PUBLIC_URL}/oauth2/authorize?${params}`);
});

// --- OAuth callback ---
app.get('/callback', async (c) => {
  const code = c.req.query('code');
  const state = c.req.query('state');
  const storedState = getCookie(c, 'oauth_state');
  const codeVerifier = getCookie(c, 'code_verifier');

  // Clean up cookies
  deleteCookie(c, 'code_verifier', { path: '/' });
  deleteCookie(c, 'oauth_state', { path: '/' });

  if (!code || !state || state !== storedState) {
    return c.json({ error: 'Invalid state or missing code' }, 400);
  }

  if (!codeVerifier) {
    return c.json({ error: 'Missing code_verifier' }, 400);
  }

  // Exchange code for tokens
  const tokenRes = await fetch(`${PROVIDER_URL}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    return c.json({ error: 'Token exchange failed', details: err }, 400);
  }

  const tokens = (await tokenRes.json()) as {
    access_token: string;
    id_token?: string;
    refresh_token?: string;
  };

  // Decode id_token to get user info
  const payload = JSON.parse(Buffer.from(tokens.id_token!.split('.')[1], 'base64url').toString());

  // Create session
  const sessionId = crypto.randomBytes(32).toString('base64url');
  sessions.set(sessionId, {
    sub: payload.sub,
    email: payload.email,
    name: payload.name,
    accessToken: tokens.access_token,
  });

  setCookie(c, 'session', sessionId, { httpOnly: true, path: '/', sameSite: 'Lax', maxAge: 86400 });

  return c.redirect(FRONTEND_URL);
});

// --- Get current user ---
app.get('/me', (c) => {
  const sessionId = getCookie(c, 'session');
  if (!sessionId) return c.json({ user: null });

  const session = sessions.get(sessionId);
  if (!session) return c.json({ user: null });

  return c.json({ user: { sub: session.sub, email: session.email, name: session.name } });
});

// --- Logout ---
app.post('/logout', (c) => {
  const sessionId = getCookie(c, 'session');
  if (sessionId) {
    sessions.delete(sessionId);
    deleteCookie(c, 'session', { path: '/' });
  }
  return c.json({ ok: true });
});

export default app;
