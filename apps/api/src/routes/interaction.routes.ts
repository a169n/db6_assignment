import type { FastifyInstance } from 'fastify';
import { InteractionController } from '@controllers/interaction.controller';
import { InteractionService } from '@services/interaction.service';

export default async function interactionRoutes(app: FastifyInstance) {
  const controller = new InteractionController(new InteractionService());

  app.post('/interactions', { preValidation: [app.authenticate, app.csrfProtection] }, controller.create);
}
