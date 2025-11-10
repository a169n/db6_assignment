import type { Response } from 'express';
import { createInteractionSchema } from '@schemas/interaction.schema';
import { InteractionService } from '@services/interaction.service';
import type { AuthenticatedRequest } from '@types/request';
import { redisClient } from '@plugins/redis';

export class InteractionController {
  constructor(private readonly service: InteractionService) {}

  create = async (request: AuthenticatedRequest, response: Response) => {
    const { productId, type } = createInteractionSchema.parse(request.body);
    const userId = request.user?.sub;
    if (!userId) {
      return response.status(401).json({ error: 'UNAUTHORIZED' });
    }
    await this.service.record(userId, productId, type);
    if (type === 'purchase' && redisClient.isOpen) {
      await redisClient.del(`reco:user:${userId}`);
      await redisClient.del(`reco:item:${userId}`);
    }
    return response.status(201).json({ ok: true });
  };
}
