import type { Application } from 'express';
import { SystemController } from '@controllers/system.controller';
import { asyncHandler } from '@utils/async-handler';

export function registerSystemRoutes(app: Application) {
  const controller = new SystemController();
  app.get('/health', asyncHandler(controller.health));
  app.get('/ready', asyncHandler(controller.ready));
  app.get('/metrics', asyncHandler(controller.metrics));
}
