import type { FastifyInstance } from 'fastify';
import { RecommendationController } from '@controllers/reco.controller';
import { RecommendationService } from '@reco/recommendation.service';

export default async function recoRoutes(app: FastifyInstance) {
  const controller = new RecommendationController(new RecommendationService(app));

  app.get('/reco', { preValidation: [app.authenticate] }, controller.get);
}
