import { Types } from 'mongoose';
import { logger } from '@config/logger';
import { ProductModel } from '@models/product.model';
import { InteractionModel } from '@models/interaction.model';
import { metricsStore } from '@lib/metrics';
import { redisClient } from '@plugins/redis';
import { UserModel } from '@models/user.model';

interface SimilarityScore {
  id: string;
  score: number;
  reason: string;
}

const CACHE_TTL_SECONDS = 60 * 10;

export class RecommendationService {
  private cacheKey(userId: string, mode: 'user' | 'item') {
    return `reco:${mode}:${userId}`;
  }

  private async readCache<T>(key: string): Promise<T | null> {
    if (!redisClient.isOpen) {
      return null;
    }
    const cached = await redisClient.get(key);
    return cached ? (JSON.parse(cached) as T) : null;
  }

  private async writeCache(key: string, value: unknown) {
    if (!redisClient.isOpen) {
      return;
    }
    await redisClient.set(key, JSON.stringify(value), {
      EX: CACHE_TTL_SECONDS
    });
  }

  async getRecommendations(userId: string, mode: 'user' | 'item', limit: number) {
    const key = this.cacheKey(userId, mode);
    const cached = await this.readCache<SimilarityScore[]>(key);
    if (cached) {
      metricsStore.recordCache(true);
      return cached;
    }
    metricsStore.recordCache(false);

    const start = Date.now();
    const recommendations =
      mode === 'item'
        ? await this.itemBasedRecommendations(userId, limit)
        : await this.userBasedRecommendations(userId, limit);

    const latency = Date.now() - start;
    metricsStore.recordLatency(latency);
    logger.debug({ userId, mode, latency }, 'computed recommendations');

    if (recommendations.length) {
      await this.writeCache(key, recommendations);
    }

    return recommendations;
  }

  private async userBasedRecommendations(userId: string, limit: number): Promise<SimilarityScore[]> {
    const interactions = await InteractionModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$productId',
          weight: { $sum: '$weight' }
        }
      }
    ]);

    if (!interactions.length) {
      return this.coldStart(limit);
    }

    const userVector = new Map<string, number>();
    interactions.forEach((i) => userVector.set(i._id.toString(), i.weight));

    const otherInteractions = await InteractionModel.aggregate([
      { $match: { userId: { $ne: new Types.ObjectId(userId) } } },
      {
        $group: {
          _id: { userId: '$userId', productId: '$productId' },
          weight: { $sum: '$weight' }
        }
      }
    ]);

    const userTotals = new Map<string, number>();
    const similarity = new Map<string, number>();

    for (const entry of otherInteractions) {
      const uId = entry._id.userId.toString();
      const pId = entry._id.productId.toString();
      userTotals.set(uId, (userTotals.get(uId) || 0) + entry.weight ** 2);
      if (userVector.has(pId)) {
        similarity.set(uId, (similarity.get(uId) || 0) + entry.weight * (userVector.get(pId) || 0));
      }
    }

    const userMagnitudes = new Map<string, number>();
    for (const [u, total] of userTotals) {
      userMagnitudes.set(u, Math.sqrt(total));
    }
    const targetMagnitude = Math.sqrt(
      Array.from(userVector.values()).reduce((sum, v) => sum + v ** 2, 0)
    );

    const neighborScores: [string, number][] = [];
    for (const [u, dot] of similarity) {
      const score = dot / ((userMagnitudes.get(u) || 1) * targetMagnitude || 1);
      neighborScores.push([u, score]);
    }

    neighborScores.sort((a, b) => b[1] - a[1]);
    const topNeighbors = neighborScores.slice(0, 30);

    const neighborIds = topNeighbors.map(([id]) => new Types.ObjectId(id));
    if (!neighborIds.length) {
      return this.coldStart(limit);
    }

    const neighborProfiles = await UserModel.find({ _id: { $in: neighborIds } })
      .select({ name: 1 })
      .lean();
    const neighborNameMap = new Map(
      neighborProfiles.map((profile) => [profile._id.toString(), profile.name || 'Similar shopper'])
    );

    const formatNeighborNames = (ids: string[]) =>
      ids
        .map((id) => neighborNameMap.get(id) || `User ${id.slice(-4)}`)
        .join(', ');

    const neighborInteractions = await InteractionModel.aggregate([
      { $match: { userId: { $in: neighborIds } } },
      {
        $group: {
          _id: { productId: '$productId' },
          score: { $sum: '$weight' }
        }
      }
    ]);

    const seenProducts = new Set(userVector.keys());
    const recommendations: SimilarityScore[] = neighborInteractions
      .filter((i) => !seenProducts.has(i._id.productId.toString()))
      .map((i) => ({
        id: i._id.productId.toString(),
        score: i.score,
        reason: `Similar users (${formatNeighborNames(topNeighbors.slice(0, 3).map(([id]) => id))})`
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return recommendations.length ? recommendations : this.coldStart(limit);
  }

  private async itemBasedRecommendations(userId: string, limit: number): Promise<SimilarityScore[]> {
    const recentPurchases = await InteractionModel.find({
      userId,
      type: { $in: ['like', 'purchase'] }
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const productIds = recentPurchases.map((i) => i.productId.toString());
    if (!productIds.length) {
      return this.coldStart(limit);
    }

    const cooccurrence = await InteractionModel.aggregate([
      { $match: { productId: { $in: productIds.map((id) => new Types.ObjectId(id)) } } },
      {
        $group: {
          _id: {
            productId: '$productId',
            userId: '$userId'
          },
          weight: { $sum: '$weight' }
        }
      },
      {
        $group: {
          _id: '$_id.userId',
          interactions: {
            $push: {
              productId: '$_id.productId',
              weight: '$weight'
            }
          }
        }
      }
    ]);

    const scores = new Map<string, number>();

    for (const user of cooccurrence) {
      const interactions = user.interactions as { productId: Types.ObjectId; weight: number }[];
      for (const interaction of interactions) {
        const id = interaction.productId.toString();
        if (productIds.includes(id)) continue;
        scores.set(id, (scores.get(id) || 0) + interaction.weight);
      }
    }

    const recommendations = Array.from(scores.entries())
      .map(([id, score]) => ({
        id,
        score,
        reason: 'Similar products from co-occurring users'
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return recommendations.length ? recommendations : this.coldStart(limit);
  }

  private async coldStart(limit: number): Promise<SimilarityScore[]> {
    const products = await ProductModel.find().sort({ createdAt: -1 }).limit(limit).lean();
    return products.map((product) => ({
      id: product._id.toString(),
      score: 0,
      reason: 'Popular products'
    }));
  }
}
