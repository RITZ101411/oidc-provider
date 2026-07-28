import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { env } from '../config.js';

const route = createRoute({
  method: 'get',
  path: '/.well-known/openid-configuration',
  responses: {
    200: {
      description: 'OpenID Connect Discovery',
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
