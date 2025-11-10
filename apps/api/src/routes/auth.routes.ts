import type { FastifyInstance } from 'fastify';
import { AuthService } from '@services/auth.service';
import { AuthController } from '@controllers/auth.controller';

export default async function authRoutes(app: FastifyInstance) {
  const service = new AuthService(app);
  const controller = new AuthController(service);

  app.post('/auth/register', controller.register);
  app.post('/auth/login', controller.login);
  app.post('/auth/refresh', controller.refresh);
  app.post('/auth/logout', controller.logout);
  app.get('/me', { preValidation: [app.authenticate] }, controller.me);
}
