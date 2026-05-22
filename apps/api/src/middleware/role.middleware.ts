import { NextFunction, Request, Response } from 'express';
import { UserRole } from '@assessment-ai/database';
import { ForbiddenError, UnauthorizedError } from '../common/errors';

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) throw new UnauthorizedError();
    if (!roles.includes(req.user.role as UserRole)) throw new ForbiddenError();
    next();
  };
}

export const requireAdmin = requireRole(UserRole.ADMIN);
