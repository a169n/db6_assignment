import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { env } from '@config/env';
import { UserModel } from '@models/user.model';
import { redisClient } from '@plugins/redis';
import { logger } from '@config/logger';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const localRefreshTokens = new Set<string>();
const REFRESH_TTL_SECONDS = 60 * 60 * 24 * 7;

function refreshKey(userId: string, token: string) {
  return `refresh:${userId}:${token}`;
}

export class AuthService {
  async hashPassword(password: string) {
    return argon2.hash(password, { memoryCost: Number(env.BCRYPT_MEMORY_COST) });
  }

  async verifyPassword(hash: string, password: string) {
    return argon2.verify(hash, password);
  }

  async generateTokens(userId: string, isAdmin: boolean): Promise<TokenPair> {
    const accessExpiresIn = env.ACCESS_TOKEN_TTL as StringValue | number;
    const refreshExpiresIn = env.REFRESH_TOKEN_TTL as StringValue | number;

    const accessToken = jwt.sign(
      { sub: userId, type: 'access', isAdmin },
      env.JWT_ACCESS_SECRET,
      { expiresIn: accessExpiresIn }
    );
    const refreshToken = jwt.sign(
      { sub: userId, type: 'refresh', isAdmin },
      env.JWT_REFRESH_SECRET,
      { expiresIn: refreshExpiresIn }
    );
    const key = refreshKey(userId, refreshToken);
    await this.storeRefreshToken(key);
    return { accessToken, refreshToken };
  }

  async revokeRefreshToken(userId: string, token: string) {
    const key = refreshKey(userId, token);
    await this.deleteRefreshToken(key);
  }

  async verifyRefreshToken(userId: string, token: string) {
    const key = refreshKey(userId, token);
    if (!redisClient.isOpen) {
      return localRefreshTokens.has(key);
    }
    try {
      const exists = await redisClient.get(key);
      return Boolean(exists);
    } catch (err) {
      logger.warn({ err }, 'Failed to verify refresh token in Redis, falling back to memory store');
      await redisClient.disconnect().catch(() => undefined);
      return localRefreshTokens.has(key);
    }
  }

  async register(data: { email: string; password: string; name: string; prefs?: any }) {
    const existing = await UserModel.findOne({ email: data.email });
    if (existing) {
      throw new Error('EMAIL_TAKEN');
    }
    const passwordHash = await this.hashPassword(data.password);
    const user = await UserModel.create({
      email: data.email,
      passwordHash,
      name: data.name,
      prefs: data.prefs || { categories: [] }
    });
    return user;
  }

  async getById(id: string) {
    return UserModel.findById(id);
  }

  async validateUser(email: string, password: string) {
    const user = await UserModel.findOne({ email });
    if (!user) return null;
    const valid = await this.verifyPassword(user.passwordHash, password);
    if (!valid) return null;
    return user;
  }

  private async storeRefreshToken(key: string) {
    if (redisClient.isOpen) {
      try {
        await redisClient.set(key, '1', { EX: REFRESH_TTL_SECONDS });
        return;
      } catch (err) {
        logger.warn({ err }, 'Failed to write refresh token to Redis, falling back to memory store');
        await redisClient.disconnect().catch(() => undefined);
      }
    }
    localRefreshTokens.add(key);
  }

  private async deleteRefreshToken(key: string) {
    if (redisClient.isOpen) {
      try {
        await redisClient.del(key);
        return;
      } catch (err) {
        logger.warn({ err }, 'Failed to delete refresh token from Redis, clearing local copy instead');
        await redisClient.disconnect().catch(() => undefined);
      }
    }
    localRefreshTokens.delete(key);
  }
}
