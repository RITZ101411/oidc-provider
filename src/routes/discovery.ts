import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { env } from '../config.js';

const DiscoveryResponseSchema = z.object({
  issuer: z.string().url(),
  authorization_endpoint: z.string().url(),
  token_endpoint: z.string().url(),
  userinfo_endpoint: z.string().url(),
  jwks_uri: z.string().url(),
  response_types_supported: z.array(z.string()),
  subject_types_supported: z.array(z.string()),
  id_token_signing_alg_values_supported: z.array(z.string()),
  scopes_supported: z.array(z.string()),
  token_endpoint_auth_methods_supported: z.array(z.string()),
  claims_supported: z.array(z.string()),
  code_challenge_methods_supported: z.array(z.string()),
  grant_types_supported: z.array(z.string()),
});

const route = createRoute({
  method: 'get',
  path: '/.well-known/openid-configuration',
  tags: ['Discovery'],
  summary: 'OpenID Connect Discovery',
  description: 'Returns the OpenID Connect Provider metadata.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: DiscoveryResponseSchema,
        },
      },
      description: 'OpenID Connect Provider metadata',
    },
  },
});

export const discovery = new OpenAPIHono();

discovery.openapi(route, (c) => {
  const issuer = env.ISSUER_URL;

  return c.json({
    issuer,
    authorization_endpoint: `${issuer}/authorize`,
    token_endpoint: `${issuer}/token`,
    userinfo_endpoint: `${issuer}/userinfo`,
    jwks_uri: `${issuer}/.well-known/jwks.json`,
    response_types_supported: ['code'],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['RS256'],
    scopes_supported: ['openid', 'profile', 'email'],
    token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post'],
    claims_supported: ['sub', 'iss', 'name', 'email', 'email_verified'],
    code_challenge_methods_supported: ['S256'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
  });
});
