import { pgTable, text, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const jwks = pgTable('jwks', {
  kid: text('kid').primaryKey(),
  privateKey: text('private_key').notNull(),
  publicKey: text('public_key').notNull(),
  algorithm: text('algorithm').notNull().default('RS256'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiredAt: timestamp('expired_at'),
});

export const clients = pgTable('clients', {
  clientId: text('client_id').primaryKey(),
  clientSecret: text('client_secret'),
  clientName: text('client_name').notNull(),
  redirectUris: jsonb('redirect_uris').$type<string[]>().notNull(),
  grantTypes: jsonb('grant_types').$type<string[]>().notNull().default(['authorization_code']),
  responseTypes: jsonb('response_types').$type<string[]>().notNull().default(['code']),
  scopes: text('scopes').notNull().default('openid'),
  tokenEndpointAuthMethod: text('token_endpoint_auth_method').notNull().default('client_secret_basic'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const authorizationCodes = pgTable('authorization_codes', {
  code: text('code').primaryKey(),
  clientId: text('client_id').notNull().references(() => clients.clientId),
  userId: text('user_id').notNull(),
  redirectUri: text('redirect_uri').notNull(),
  scope: text('scope').notNull(),
  codeChallenge: text('code_challenge').notNull(),
  codeChallengeMethod: text('code_challenge_method').notNull().default('S256'),
  nonce: text('nonce'),
  state: text('state'),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
