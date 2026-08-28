import { serve } from '@hono/node-server';
import app from './app.js';

const port = Number(process.env.PORT || 8080);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Client server running on http://localhost:${info.port}`);
});
