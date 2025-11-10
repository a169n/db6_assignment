import type { Application } from 'express';
import { InteractionController } from '@controllers/interaction.controller';
import { InteractionService } from '@services/interaction.service';
import { authenticate, csrfProtection } from '@middleware/auth';
import { asyncHandler } from '@utils/async-handler';

export function registerInteractionRoutes(app: Application) {
  const controller = new InteractionController(new InteractionService());

  app.post('/interactions', authenticate, csrfProtection, asyncHandler(controller.create));
}
