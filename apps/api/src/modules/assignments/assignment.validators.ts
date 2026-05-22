import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodSchema } from 'zod';

export function validateAssignmentBody<T>(schema: ZodSchema<T>): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
  };
}

export function validateAssignmentQuery<T>(schema: ZodSchema<T>): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.query = schema.parse(req.query) as Request['query'];
    next();
  };
}

export function validateAssignmentParams<T>(schema: ZodSchema<T>): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.params = schema.parse(req.params) as Request['params'];
    next();
  };
}
