import { config } from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { z } from 'zod';

function resolveEnvPath() {
  if (process.env.API_ENV_PATH) {
    return process.env.API_ENV_PATH;
  }
  let current = process.cwd();
  const root = path.parse(current).root;
  while (true) {
    const candidate = path.join(current, '.env');
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    if (current === root) {
      return undefined;
    }
    current = path.dirname(current);
  }
}

config({ path: resolveEnvPath() });

type SecretNames = 'JWT_ACCESS_SECRET' | 'JWT_REFRESH_SECRET';

const generatedSecrets = new Set<SecretNames>();

function ensureSecret(name: SecretNames) {
  const existing = process.env[name];
  if (existing && existing.trim().length > 0) {
    return existing;
  }
  const generated = randomBytes(48).toString('hex');
  process.env[name] = generated;
  generatedSecrets.add(name);
  return generated;
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('4000'),
  MONGO_URI: z.string().default('mongodb://localhost:27017/nova'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_ACCESS_SECRET: z.string().default(ensureSecret('JWT_ACCESS_SECRET')),
  JWT_REFRESH_SECRET: z.string().default(ensureSecret('JWT_REFRESH_SECRET')),
  WEB_ORIGIN: z.string().default('http://localhost:5173'),
  DOCS_ORIGIN: z.string().optional(),
  RECO_MODE: z.enum(['user', 'item']).default('user'),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL: z.string().default('7d'),
  BCRYPT_MEMORY_COST: z.string().default('19456'),
  RATE_LIMIT_MAX: z.string().default('100'),
  RATE_LIMIT_WINDOW: z.string().default('60000')
});

type EnvSchema = z.infer<typeof envSchema>;
const parsedEnv = envSchema.parse(process.env) as EnvSchema;

export const env: EnvSchema & { DOCS_ORIGIN: string } = {
  ...parsedEnv,
  DOCS_ORIGIN: parsedEnv.DOCS_ORIGIN && parsedEnv.DOCS_ORIGIN.trim().length > 0
    ? parsedEnv.DOCS_ORIGIN
    : `http://localhost:${parsedEnv.PORT}`
};

if (generatedSecrets.size > 0) {
  console.warn(
    `Generated fallback JWT secret(s) for: ${Array.from(generatedSecrets).join(
      ', '
    )}. Tokens will be invalidated each time the server restarts. Set these in your environment to avoid this warning.`
  );
}
