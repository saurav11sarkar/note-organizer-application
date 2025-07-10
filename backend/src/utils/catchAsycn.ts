import { NextFunction, Request, Response, RequestHandler } from "express";

const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction): Promise<void> =>
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default catchAsync;