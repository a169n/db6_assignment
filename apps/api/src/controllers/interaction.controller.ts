import type { FastifyReply, FastifyRequest } from 'fastify';
import { createInteractionSchema } from '@schemas/interaction.schema';
import { InteractionService } from '@services/interaction.service';

export class InteractionController {
  constructor(private readonly service: InteractionService) {}

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const { productId, type } = createInteractionSchema.parse(request.body);
    const userId = (request.user as any).sub;
    await this.service.record(userId, productId, type);
    if (type === 'purchase') {
      await request.server.redis.del(`reco:user:${userId}`);
      await request.server.redis.del(`reco:item:${userId}`);
    }
    return reply.status(201).send({ ok: true });
  };
}
