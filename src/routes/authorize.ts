import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import crypto from 'crypto';
import { db } from '../db/index.js';
import { clients, authorizationCodes } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const AuthorizeQuerySchema = z.object({
  response_type: z.string().openapi({ description: 'Must be "code"' }),
  client_id: z.string().openapi({ description: 'Client identifier' }),
  redirect_uri: z.string().url().openapi({ description: 'Redirect URI' }),
  scope: z.string().openapi({ description: 'Space-separated scopes' }),
  state: z.string().optional().openapi({ description: 'Opaque state value' }),
  nonce: z.string().optional().openapi({ description: 'Nonce for ID Token replay protection' }),
  code_challenge: z.string().openapi({ description: 'PKCE code challenge' }),
  code_challenge_method: z.enum(['S256']).openapi({ description: 'Must be S256' }),
});

const ErrorResponseSchema = z.object({
  error: z.string(),
  error_description: z.string().optional(),
});

const route = createRoute({
  method: 'get',
  path: '/authorize',
  tags: ['Authorization'],
  summary: 'Authorization Endpoint',
  description:
    'Initiates the Authorization Code Flow with PKCE. Validates the request and returns an authorization code via redirect.',
  request: {
    query: AuthorizeQuerySchema,
  },
  responses: {
    302: {
      description: 'Redirect with authorization code',
      headers: z.object({
        Location: z.string(),
      }),
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: 'Invalid request parameters',
    },
  },
});

export const authorizeRoute = new OpenAPIHono();

authorizeRoute.openapi(route, async (c) => {
  const {
    response_type,
    client_id,
    redirect_uri,
    scope,
    state,
    nonce,
    code_challenge,
    code_challenge_method,
  } = c.req.valid('query');

  // 1. Validate response_type
  if (response_type !== 'code') {
    return c.json(
      { error: 'unsupported_response_type', error_description: 'Only "code" response_type is supported' },
      400,
    );
  }

  // 2. Validate client
  const [client] = await db
    .select()
    .from(clients)
    .where(eq(clients.clientId, client_id))
    .limit(1);

  if (!client) {
    return c.json(
      { error: 'invalid_client', error_description: 'Client not found' },
      400,
    );
  }

  // 3. Validate redirect_uri
  if (!client.redirectUris.includes(redirect_uri)) {
    return c.json(
      { error: 'invalid_request', error_description: 'redirect_uri is not registered for this client' },
      400,
    );
  }

  // 4. Validate scopes
  const requestedScopes = scope.split(' ');
  const allowedScopes = client.scopes.split(' ');
  const invalidScopes = requestedScopes.filter((s) => !allowedScopes.includes(s));

  if (invalidScopes.length > 0) {
    return redirectWithError(redirect_uri, 'invalid_scope', `Invalid scopes: ${invalidScopes.join(', ')}`, state);
  }

  // 5. Validate response_type is allowed for this client
  if (!client.responseTypes.includes(response_type)) {
    return redirectWithError(redirect_uri, 'unsupported_response_type', 'Client does not support this response_type', state);
  }

  // 6. Generate authorization code
  const code = crypto.randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  //placeholder
  const userId = 'placeholder-user';

  await db.insert(authorizationCodes).values({
    code,
    clientId: client_id,
    userId,
    redirectUri: redirect_uri,
    scope,
    codeChallenge: code_challenge,
    codeChallengeMethod: code_challenge_method,
    nonce: nonce ?? null,
    state: state ?? null,
    expiresAt,
  });

  // 7. Redirect with code
  const redirectUrl = new URL(redirect_uri);
  redirectUrl.searchParams.set('code', code);
  if (state) {
    redirectUrl.searchParams.set('state', state);
  }

  return c.redirect(redirectUrl.toString(), 302);
});

function redirectWithError(
  redirectUri: string,
  error: string,
  errorDescription: string,
  state?: string,
) {
  const url = new URL(redirectUri);
  url.searchParams.set('error', error);
  url.searchParams.set('error_description', errorDescription);
  if (state) {
    url.searchParams.set('state', state);
  }
  return Response.redirect(url.toString(), 302);
}
