import { serve } from '@hono/node-server';
import { getMigrations } from 'better-auth/db/migration';
import app from './app.js';
import { auth } from './auth.js';

const port = Number(process.env.PORT || 3000);

// Run migrations on startup
const { toBeCreated, toBeAdded, runMigrations } = await getMigrations(auth.options);
if (toBeCreated.length > 0 || toBeAdded.length > 0) {
  console.log('Running migrations...');
  await runMigrations();
  console.log(`Migrated: ${toBeCreated.length} tables created, ${toBeAdded.length} columns added`);
}

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`OIDC Provider running on http://localhost:${info.port}`);
  console.log(`Discovery: http://localhost:${info.port}/api/auth/.well-known/openid-configuration`);
});
