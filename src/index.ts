import { serve } from '@hono/node-server';
import { env } from './config.js';
import app from './app.js';

const port = Number(env.PORT);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server running on http://localhost:${info.port}`);
});

export default app;
