import mongoose from 'mongoose';
import { env } from '@config/env';
import { logger } from '@config/logger';

export async function connectMongo() {
  mongoose.set('strictQuery', true);
  if (process.env.NODE_ENV === 'test') {
    logger.warn('Skipping MongoDB connection in test mode');
    return;
  }
  if (mongoose.connection.readyState === 1) {
    return;
  }
  await mongoose.connect(env.MONGO_URI);
  logger.info('Connected to MongoDB');
}

export async function disconnectMongo() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
