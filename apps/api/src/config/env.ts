import { config } from 'dotenv';
import { z } from 'zod';

config({ path: process.env.API_ENV_PATH || undefined });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('4000'),
  MONGO_URI: z.string().default('mongodb://localhost:27017/nova'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_ACCESS_SECRET: z.string().default('changeme-access-secret-changeme-access'),
  JWT_REFRESH_SECRET: z.string().default('changeme-refresh-secret-changeme-refresh'),
  WEB_ORIGIN: z.string().default('http://localhost:5173'),
  RECO_MODE: z.enum(['user', 'item']).default('user'),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL: z.string().default('7d'),
  BCRYPT_MEMORY_COST: z.string().default('19456'),
  RATE_LIMIT_MAX: z.string().default('100'),
  RATE_LIMIT_WINDOW: z.string().default('60000')
});

export const env = envSchema.parse(process.env);
