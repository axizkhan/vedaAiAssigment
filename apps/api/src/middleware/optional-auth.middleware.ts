import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../modules/auth/auth.tokens';
import { extractBearerToken } from '../modules/auth/auth.utils';

export function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const token = extractBearerToken(req.header('authorization'));
  if (!token) {
    next();
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      sessionId: payload.sessionId,
    };
  } catch {
    // Public and hybrid routes should not leak token verification details.
  }

  next();
}
