import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const jwks = pgTable('jwks', {
  kid: text('kid').primaryKey(),
  privateKey: text('private_key').notNull(),
  publicKey: text('public_key').notNull(),
  algorithm: text('algorithm').notNull().default('RS256'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiredAt: timestamp('expired_at'),
});
