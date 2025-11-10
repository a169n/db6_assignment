import fs from 'node:fs';
import path from 'node:path';
import type { Server } from 'http';
import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { parse } from 'yaml';
import { env } from '@config/env';
import { logger } from '@config/logger';
import { connectMongo, disconnectMongo } from '@plugins/mongoose';
import { connectRedis, disconnectRedis } from '@plugins/redis';
import { registerAuthRoutes } from '@routes/auth.routes';
import { registerProductRoutes } from '@routes/product.routes';
import { registerInteractionRoutes } from '@routes/interaction.routes';
import { registerRecoRoutes } from '@routes/reco.routes';
import { registerSearchRoutes } from '@routes/search.routes';
import { registerSystemRoutes } from '@routes/system.routes';
import { metricsStore } from '@lib/metrics';
import { ZodError } from 'zod';

const docsPath = path.join(__dirname, '../../../docs/openapi.yaml');
const swaggerDocument = parse(fs.readFileSync(docsPath, 'utf8'));

export const app: Application = express();

app.use(pinoHttp({ logger }));
app.use(cookieParser());
app.use(
  cors({
    origin: env.WEB_ORIGIN,
    credentials: true
  })
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  rateLimit({
    windowMs: Number(env.RATE_LIMIT_WINDOW),
    max: Number(env.RATE_LIMIT_MAX)
  })
);
app.use((req, _res, next) => {
  metricsStore.incRequest();
  next();
});
app.use('/static', express.static(path.join(__dirname, '../../../docs')));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

registerSystemRoutes(app);
registerAuthRoutes(app);
registerProductRoutes(app);
registerInteractionRoutes(app);
registerRecoRoutes(app);
registerSearchRoutes(app);

app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', details: err.flatten() });
  }
  logger.error({ err }, 'Unhandled error');
  return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
});

export async function initializeApp() {
  await connectMongo();
  await connectRedis();
}

export async function shutdownApp() {
  await Promise.all([disconnectMongo(), disconnectRedis()]);
}

export async function start(): Promise<Server> {
  await initializeApp();
  const port = Number(env.PORT);
  return new Promise<Server>((resolve) => {
    const server = app.listen(port, '0.0.0.0', () => {
      logger.info(`API running on ${port}`);
      resolve(server);
    });
  });
}

export default app;
