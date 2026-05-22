import { NextFunction, Request, Response } from 'express';
import { InvalidTokenError, UnauthorizedError } from '../common/errors';
import { verifyAccessToken } from '../modules/auth/auth.tokens';
import { extractBearerToken } from '../modules/auth/auth.utils';

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const token = extractBearerToken(req.header('authorization'));
  if (!token) throw new UnauthorizedError();

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      sessionId: payload.sessionId,
    };
    next();
  } catch {
    throw new InvalidTokenError();
  }
}
