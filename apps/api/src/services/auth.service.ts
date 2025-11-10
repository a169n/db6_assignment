import argon2 from 'argon2';
import type { FastifyInstance } from 'fastify';
import { env } from '@config/env';
import { UserModel } from '@models/user.model';
import { redisClient } from '@plugins/redis';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  constructor(private readonly app: FastifyInstance) {}

  async hashPassword(password: string) {
    return argon2.hash(password, { memoryCost: Number(env.BCRYPT_MEMORY_COST) });
  }

  async verifyPassword(hash: string, password: string) {
    return argon2.verify(hash, password);
  }

  async generateTokens(userId: string): Promise<TokenPair> {
    const accessToken = this.app.jwt.sign(
      { sub: userId, type: 'access' },
      { expiresIn: env.ACCESS_TOKEN_TTL, sign: { key: env.JWT_ACCESS_SECRET } }
    );
    const refreshToken = this.app.jwt.sign(
      { sub: userId, type: 'refresh' },
      { expiresIn: env.REFRESH_TOKEN_TTL, sign: { key: env.JWT_REFRESH_SECRET } }
    );
    await redisClient.set(`refresh:${userId}:${refreshToken}`, '1', {
      EX: 60 * 60 * 24 * 7
    });
    return { accessToken, refreshToken };
  }

  async revokeRefreshToken(userId: string, token: string) {
    await redisClient.del(`refresh:${userId}:${token}`);
  }

  async verifyRefreshToken(userId: string, token: string) {
    const exists = await redisClient.get(`refresh:${userId}:${token}`);
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
