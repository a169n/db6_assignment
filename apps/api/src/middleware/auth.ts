import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@config/env';

export function authenticate(request: Request, response: Response, next: NextFunction) {
  const token = request.cookies?.accessToken;
  if (!token) {
    return response.status(401).json({ error: 'UNAUTHORIZED' });
  }
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as {
      sub: string;
      isAdmin?: boolean;
    };
    request.user = { sub: payload.sub, isAdmin: payload.isAdmin ?? false };
    return next();
  } catch (error) {
    return response.status(401).json({ error: 'UNAUTHORIZED' });
  }
}

export function requireAdmin(request: Request, response: Response, next: NextFunction) {
  if (!request.user?.isAdmin) {
    return response.status(403).json({ error: 'FORBIDDEN' });
  }
  return next();
}

export function csrfProtection(request: Request, response: Response, next: NextFunction) {
  const origin = request.headers.origin || request.headers.referer;
  if (origin && !origin.toString().startsWith(env.WEB_ORIGIN)) {
    return response.status(403).json({ error: 'CSRF_REJECTED' });
  }
  return next();
}
