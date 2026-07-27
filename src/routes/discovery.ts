import { OpenAPIHono, createRoute } from '@hono/zod-openapi';

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
  return c.json({});
});