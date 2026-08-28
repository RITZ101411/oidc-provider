import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { auth } from './auth.js';

const app = new Hono();

app.use('/api/auth/*', cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.all('/api/auth/*', (c) => auth.handler(c.req.raw));

export default app;
