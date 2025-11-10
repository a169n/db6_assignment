import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from '@services/auth.service';
import { registerSchema, loginSchema } from '@schemas/auth.schema';
import { env } from '@config/env';
import { logger } from '@config/logger';
import type { AuthenticatedRequest } from '@app-types/request';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (request: Request, response: Response) => {
    const data = registerSchema.parse(request.body);
    try {
      const user = await this.authService.register(data);
      const tokens = await this.authService.generateTokens(user.id, user.isAdmin);
      this.setTokens(response, tokens);
      return response.status(201).json({ user: this.sanitizeUser(user) });
    } catch (error) {
      if ((error as Error).message === 'EMAIL_TAKEN') {
        return response.status(409).json({ error: 'EMAIL_TAKEN' });
      }
      throw error;
    }
  };

  login = async (request: Request, response: Response) => {
    const { email, password } = loginSchema.parse(request.body);
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      return response.status(401).json({ error: 'INVALID_CREDENTIALS' });
    }
    const tokens = await this.authService.generateTokens(user.id, user.isAdmin);
    this.setTokens(response, tokens);
    return response.json({ user: this.sanitizeUser(user) });
  };

  refresh = async (request: Request, response: Response) => {
    const bodyToken = (request.body as any)?.refreshToken;
    const refreshToken = bodyToken || request.cookies?.refreshToken;
    if (!refreshToken) {
      return response.status(400).json({ error: 'MISSING_REFRESH_TOKEN' });
    }
    try {
      const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
        sub: string;
        isAdmin?: boolean;
      };
      const valid = await this.authService.verifyRefreshToken(payload.sub, refreshToken);
      if (!valid) {
        return response.status(401).json({ error: 'TOKEN_REVOKED' });
      }
      const tokens = await this.authService.generateTokens(payload.sub, payload.isAdmin ?? false);
      await this.authService.revokeRefreshToken(payload.sub, refreshToken);
      this.setTokens(response, tokens);
      return response.json({ ok: true });
    } catch (error) {
      return response.status(401).json({ error: 'TOKEN_REVOKED' });
    }
  };

  logout = async (request: Request, response: Response) => {
    const refreshToken = request.cookies?.refreshToken;
    if (refreshToken) {
      try {
        const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { sub: string };
        await this.authService.revokeRefreshToken(payload.sub, refreshToken);
      } catch (err) {
        logger.warn({ err }, 'failed to revoke refresh token');
      }
    }
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');
    return response.status(204).send();
  };

  me = async (request: AuthenticatedRequest, response: Response) => {
    const ctxUser = request.user;
    if (!ctxUser) {
      return response.status(401).json({ error: 'UNAUTHORIZED' });
    }
    const user = await this.authService.getById(ctxUser.sub);
    if (!user) {
      return response.status(401).json({ error: 'UNAUTHORIZED' });
    }
    return response.json({ user: this.sanitizeUser(user) });
  };

  private sanitizeUser(user: any) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      prefs: user.prefs,
      isAdmin: user.isAdmin
    };
  }

  private setTokens(response: Response, tokens: { accessToken: string; refreshToken: string }) {
    const accessMaxAgeMs = 1000 * 60 * 15;
    const refreshMaxAgeMs = 1000 * 60 * 60 * 24 * 7;

    response
      .cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: env.NODE_ENV === 'production',
        path: '/',
        maxAge: accessMaxAgeMs
      })
      .cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: env.NODE_ENV === 'production',
        path: '/',
        maxAge: refreshMaxAgeMs
      });
  }
}
