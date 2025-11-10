import fp from 'fastify-plugin';
import { createClient } from 'redis';
import { env } from '@config/env';

export const redisClient = createClient({ url: env.REDIS_URL });

export default fp(async (fastify) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  fastify.decorate('redis', redisClient);
  fastify.addHook('onClose', async () => {
    await redisClient.quit();
  });
});
