import type { Application } from 'express';
import { RecommendationController } from '@controllers/reco.controller';
import { RecommendationService } from '@reco/recommendation.service';
import { authenticate } from '@middleware/auth';
import { asyncHandler } from '@utils/async-handler';

export function registerRecoRoutes(app: Application) {
  const controller = new RecommendationController(new RecommendationService());

  app.get('/reco', authenticate, asyncHandler(controller.get));
}
