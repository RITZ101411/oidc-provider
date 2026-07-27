import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';

const app = new OpenAPIHono();

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    title: 'oidc-provider',
    version: '1.0.0',
    description: 'This is OpenID Connect Provider',
  },
});

app.get('/ui', swaggerUI({ url: './doc' }));

export default app;
