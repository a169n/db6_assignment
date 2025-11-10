import type { Response } from 'express';
import { RecommendationService } from '@reco/recommendation.service';
import { recommendationSchema } from '@schemas/reco.schema';
import { ProductModel } from '@models/product.model';
import type { AuthenticatedRequest } from '@app-types/request';

export class RecommendationController {
  constructor(private readonly service: RecommendationService) {}

  get = async (request: AuthenticatedRequest, response: Response) => {
    const userId = request.user?.sub;
    if (!userId) {
      return response.status(401).json({ error: 'UNAUTHORIZED' });
    }
    const { mode, limit } = recommendationSchema.parse(request.query);
    const recommendations = await this.service.getRecommendations(userId, mode || 'user', limit);
    const productDocs = await ProductModel.find({
      _id: { $in: recommendations.map((r) => r.id) }
    });
    const products = recommendations
      .map((reco) => ({
        score: reco.score,
        reason: reco.reason,
        product: productDocs.find((doc) => doc.id === reco.id)
      }))
      .filter((entry) => entry.product !== undefined);

    return response.json({ products });
  };
}
