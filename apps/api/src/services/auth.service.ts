import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { env } from '@config/env';
import { UserModel } from '@models/user.model';
import { redisClient } from '@plugins/redis';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const localRefreshTokens = new Set<string>();

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
    const accessToken = jwt.sign(
      { sub: userId, type: 'access', isAdmin },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.ACCESS_TOKEN_TTL }
    );
    const refreshToken = jwt.sign(
      { sub: userId, type: 'refresh', isAdmin },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.REFRESH_TOKEN_TTL }
    );
    const key = refreshKey(userId, refreshToken);
    if (redisClient.isOpen) {
      await redisClient.set(key, '1', {
        EX: 60 * 60 * 24 * 7
      });
    } else {
      localRefreshTokens.add(key);
    }
    return { accessToken, refreshToken };
  }

  async revokeRefreshToken(userId: string, token: string) {
    const key = refreshKey(userId, token);
    if (redisClient.isOpen) {
      await redisClient.del(key);
    } else {
      localRefreshTokens.delete(key);
    }
  }

  async verifyRefreshToken(userId: string, token: string) {
    if (!redisClient.isOpen) {
      return localRefreshTokens.has(refreshKey(userId, token));
    }
    const exists = await redisClient.get(refreshKey(userId, token));
    return Boolean(exists);
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
}
