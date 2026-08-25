import { betterAuth } from 'better-auth';
import { jwt } from 'better-auth/plugins';
import { oauthProvider } from '@better-auth/oauth-provider';
import pg from 'pg';

const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173';

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [FRONTEND_URL],
  database: new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
  disabledPaths: ['/token'],
  plugins: [
    jwt(),
    oauthProvider({
      loginPage: `${FRONTEND_URL}/login`,
      consentPage: `${FRONTEND_URL}/consent`,
    }) as any,
  ],
});
