import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fastifyJwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '@config/env';
import { logger } from '@config/logger';
import mongoosePlugin from '@plugins/mongoose';
import redisPlugin from '@plugins/redis';
import authRoutes from '@routes/auth.routes';
import productRoutes from '@routes/product.routes';
import interactionRoutes from '@routes/interaction.routes';
import recoRoutes from '@routes/reco.routes';
import searchRoutes from '@routes/search.routes';
import systemRoutes from '@routes/system.routes';
import { metricsStore } from '@lib/metrics';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = Fastify({
  logger
});

app.register(cookie, {
  hook: 'onRequest'
});

app.register(cors, {
  origin: env.WEB_ORIGIN,
  credentials: true
});

app.register(helmet);

app.register(rateLimit, {
  max: Number(env.RATE_LIMIT_MAX),
  timeWindow: Number(env.RATE_LIMIT_WINDOW)
});

app.register(fastifyJwt, {
  secret: env.JWT_ACCESS_SECRET,
  cookie: {
    cookieName: 'accessToken'
  }
});

app.decorate('authenticate', async function (request: any, reply: any) {
  try {
    const token = request.cookies.accessToken;
    if (!token) throw new Error('Missing token');
    const decoded = this.jwt.verify(token, { key: env.JWT_ACCESS_SECRET }) as any;
    request.user = { sub: decoded.sub };
  } catch (err) {
    return reply.code(401).send({ error: 'UNAUTHORIZED' });
  }
});

app.decorate('requireAdmin', async function (request: any, reply: any) {
  await app.authenticate(request, reply);
  if (reply.sent) {
    return reply;
  }
  if (!request.user?.sub) {
    return reply.code(401).send({ error: 'UNAUTHORIZED' });
  }
  if (request.user.sub !== 'admin') {
    return reply.code(403).send({ error: 'FORBIDDEN' });
  }
});

app.decorate('csrfProtection', async function (request: any, reply: any) {
  const origin = request.headers.origin || request.headers.referer;
  if (origin && !origin.startsWith(env.WEB_ORIGIN)) {
    return reply.code(403).send({ error: 'CSRF_REJECTED' });
  }
});

app.register(mongoosePlugin);
app.register(redisPlugin);

app.addHook('onRequest', async () => {
  metricsStore.incRequest();
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'NoSQL Recommendation API',
      version: '1.0.0'
    }
  }
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs'
});

app.register(fastifyStatic, {
  root: path.join(__dirname, '../../../docs'),
  prefix: '/static/'
});

app.register(systemRoutes);
app.register(authRoutes);
app.register(productRoutes);
app.register(interactionRoutes);
app.register(recoRoutes);
app.register(searchRoutes);

app.get('/', async () => ({ status: 'ok' }));

export async function start() {
  const port = Number(env.PORT);
  await app.listen({ port, host: '0.0.0.0' });
  logger.info(`API running on ${port}`);
  return app;
}

export default app;
export type AppInstance = typeof app;
