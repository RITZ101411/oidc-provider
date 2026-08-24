import { serve } from '@hono/node-server';
import app from './app.js';

const port = Number(process.env.PORT || 3000);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`OIDC Provider running on http://localhost:${info.port}`);
  console.log(`Discovery: http://localhost:${info.port}/api/auth/.well-known/openid-configuration`);
});
