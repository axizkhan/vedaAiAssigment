import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodSchema } from 'zod';

export function validateBody<T>(schema: ZodSchema<T>): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.parse(req.body);
    req.body = parsed;
    next();
  };
}
