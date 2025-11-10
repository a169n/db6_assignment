import type { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from '@services/auth.service';
import { registerSchema, loginSchema } from '@schemas/auth.schema';
import { env } from '@config/env';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = registerSchema.parse(request.body);
    try {
      const user = await this.authService.register(data);
      const tokens = await this.authService.generateTokens(user.id);
      this.setTokens(reply, tokens);
      return reply.status(201).send({ user: this.sanitizeUser(user) });
    } catch (error) {
      if ((error as Error).message === 'EMAIL_TAKEN') {
        return reply.status(409).send({ error: 'EMAIL_TAKEN' });
      }
      throw error;
    }
  };

  login = async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = loginSchema.parse(request.body);
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      return reply.status(401).send({ error: 'INVALID_CREDENTIALS' });
    }
    const tokens = await this.authService.generateTokens(user.id);
    this.setTokens(reply, tokens);
    return { user: this.sanitizeUser(user) };
  };

  refresh = async (request: FastifyRequest, reply: FastifyReply) => {
    const bodyToken = (request.body as any)?.refreshToken;
    const refreshToken = bodyToken || request.cookies.refreshToken;
    if (!refreshToken) {
      return reply.status(400).send({ error: 'MISSING_REFRESH_TOKEN' });
    }
    try {
      const payload = request.server.jwt.verify(refreshToken, {
        key: env.JWT_REFRESH_SECRET
      }) as { sub: string };
      const valid = await this.authService.verifyRefreshToken(payload.sub, refreshToken);
      if (!valid) {
        return reply.status(401).send({ error: 'TOKEN_REVOKED' });
      }
      const tokens = await this.authService.generateTokens(payload.sub);
      await this.authService.revokeRefreshToken(payload.sub, refreshToken);
      this.setTokens(reply, tokens);
      return { ok: true };
    } catch (error) {
      return reply.status(401).send({ error: 'TOKEN_REVOKED' });
    }
  };

  logout = async (request: FastifyRequest, reply: FastifyReply) => {
    const refreshToken = request.cookies.refreshToken;
    if (refreshToken) {
      try {
        const payload = request.server.jwt.verify(refreshToken, {
          key: env.JWT_REFRESH_SECRET
        }) as { sub: string };
        await this.authService.revokeRefreshToken(payload.sub, refreshToken);
      } catch (err) {
        request.log.warn({ err }, 'failed to revoke refresh token');
      }
    }
    reply.clearCookie('accessToken');
    reply.clearCookie('refreshToken');
    return reply.status(204).send();
  };

  me = async (request: FastifyRequest, reply: FastifyReply) => {
    const ctxUser = request.user;
    if (!ctxUser) {
      return reply.status(401).send({ error: 'UNAUTHORIZED' });
    }
    const user = await this.authService.getById(ctxUser.sub);
    if (!user) {
      return reply.status(401).send({ error: 'UNAUTHORIZED' });
    }
    return { user: this.sanitizeUser(user) };
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

  private setTokens(reply: FastifyReply, tokens: { accessToken: string; refreshToken: string }) {
    reply
      .setCookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 15
      })
      .setCookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      });
  }
}
