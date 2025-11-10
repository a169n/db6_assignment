import { Types } from 'mongoose';
import { InteractionModel } from '@models/interaction.model';

const weightMap = {
  view: 1,
  like: 3,
  purchase: 5
} as const;

export class InteractionService {
  async record(userId: string, productId: string, type: 'view' | 'like' | 'purchase') {
    const weight = weightMap[type];
    await InteractionModel.create({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(productId),
      type,
      weight
    });
    if (type === 'purchase') {
      // Additional hook can be added here for reco invalidation
    }
  }

  async userInteractions(userId: string) {
    return InteractionModel.find({ userId }).lean();
  }
}
