import { z } from '@hono/zod-openapi';

const envSchema = z.object({
  PORT: z.string().optional().default('3000'),
  ISSUER_URL: z.url(),
  DATABASE_URL: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
