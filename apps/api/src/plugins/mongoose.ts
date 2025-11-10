import fp from 'fastify-plugin';
import mongoose from 'mongoose';
import { env } from '@config/env';
import { logger } from '@config/logger';

export default fp(async () => {
  mongoose.set('strictQuery', true);
  if (process.env.NODE_ENV === 'test') {
    logger.warn('Skipping MongoDB connection in test mode');
    return;
  }
  await mongoose.connect(env.MONGO_URI);
  logger.info('Connected to MongoDB');
});
