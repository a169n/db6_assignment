import type { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncHandler<TReq extends Request = Request, TRes extends Response = Response> = (
  ...args: [req: TReq, res: TRes, next: NextFunction]
) => Promise<unknown> | unknown;

export function asyncHandler<TReq extends Request = Request, TRes extends Response = Response>(
  fn: AsyncHandler<TReq, TRes>
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req as TReq, res as TRes, next)).catch(next);
  };
}
