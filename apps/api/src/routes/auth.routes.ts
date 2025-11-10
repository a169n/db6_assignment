import type { Application } from 'express';
import { Router } from 'express';
import { AuthService } from '@services/auth.service';
import { AuthController } from '@controllers/auth.controller';
import { authenticate } from '@middleware/auth';
import { asyncHandler } from '@utils/async-handler';

export function registerAuthRoutes(app: Application) {
  const service = new AuthService();
  const controller = new AuthController(service);

  const router = Router();
  router.post('/register', asyncHandler(controller.register));
  router.post('/login', asyncHandler(controller.login));
  router.post('/refresh', asyncHandler(controller.refresh));
  router.post('/logout', asyncHandler(controller.logout));

  app.use('/auth', router);
  app.get('/me', authenticate, asyncHandler(controller.me));
}
