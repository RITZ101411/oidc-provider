import { serve } from '@hono/node-server';
import { env } from './config.js';
import app from './app.js';
import { ensureActiveKey } from './application/jwk.js';

const port = Number(env.PORT);

await ensureActiveKey();

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server running on http://localhost:${info.port}`);
});

export default app;
