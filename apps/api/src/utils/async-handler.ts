import type { RequestHandler } from 'express';

type AsyncHandler = (...args: Parameters<RequestHandler>) => Promise<unknown> | unknown;

export function asyncHandler(fn: AsyncHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
