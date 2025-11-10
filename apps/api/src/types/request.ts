import { Request } from 'express';

export interface AuthenticatedUser {
  sub: string;
  isAdmin?: boolean;
}

export type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};
