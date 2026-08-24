import { createAuthClient } from 'better-auth/react';
import { oauthProviderClient } from '@better-auth/oauth-provider/client';

export const authClient = createAuthClient({
  baseURL: 'http://localhost:5173', // proxied to :3000
  plugins: [oauthProviderClient()],
});
