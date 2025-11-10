import { createClient } from 'redis';
import { env } from '@config/env';
import { logger } from '@config/logger';

export const redisClient = createClient({ url: env.REDIS_URL });

export async function connectRedis() {
  if (process.env.NODE_ENV === 'test') {
    logger.warn('Skipping Redis connection in test mode');
    return;
  }
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
      logger.info('Connected to Redis');
    } catch (error) {
      logger.warn({ err: error }, 'Failed to connect to Redis, continuing without cache');
      await redisClient.disconnect().catch(() => undefined);
    }
  }
}

export async function disconnectRedis() {
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
}
