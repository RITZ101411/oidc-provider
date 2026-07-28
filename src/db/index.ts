import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { env } from '../config.js';
import * as schema from './schema.js';

export const db: NodePgDatabase<typeof schema> = drizzle(env.DATABASE_URL, { schema });
