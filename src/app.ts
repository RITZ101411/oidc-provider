import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { discovery } from './routes/discovery.js';
import { jwksRoute } from './routes/jwks.js';

const app = new OpenAPIHono();

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    title: 'oidc-provider',
    version: '1.0.0',
    description: 'This is OpenID Connect Provider',
  },
});

app.route('/', discovery);
app.route('/', jwksRoute);

app.get('/ui', swaggerUI({ url: './doc' }));

export default app;
