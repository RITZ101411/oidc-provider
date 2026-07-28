import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { getPublicKeys } from '../application/jwk.js';

const JwksResponseSchema = z.object({
  keys: z.array(z.object({
    kty: z.string(),
    kid: z.string(),
    alg: z.string(),
    use: z.string(),
    n: z.string(),
    e: z.string(),
  })),
});

const route = createRoute({
  method: 'get',
  path: '/.well-known/jwks.json',
  tags: ['Discovery'],
  summary: 'JSON Web Key Set',
  description: 'Returns the public keys used to verify ID Token signatures.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: JwksResponseSchema,
        },
      },
      description: 'JSON Web Key Set',
    },
  },
});

export const jwksRoute = new OpenAPIHono();

jwksRoute.openapi(route, async (c) => {
  const jwks = await getPublicKeys();
  return c.json({
    keys: jwks.keys.map((key) => ({
      kty: key.kty ?? 'RSA',
      kid: key.kid,
      alg: key.alg,
      use: key.use,
      n: key.n ?? '',
      e: key.e ?? '',
    })),
  });
});
