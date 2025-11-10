import type { FastifyInstance } from 'fastify';
import { SystemController } from '@controllers/system.controller';

export default async function systemRoutes(app: FastifyInstance) {
  const controller = new SystemController();
  app.get('/health', controller.health);
  app.get('/ready', controller.ready);
  app.get('/metrics', controller.metrics);
}
