import { Request, Response, NextFunction } from 'express';
import { authTokens } from '../modules/auth/auth.tokens';
import { authSession } from '../modules/auth/auth.session';
import { logger } from '@assessment-ai/logger';

export const extractBearerToken = (authHeader?: string): string | null => {
  if (!authHeader || typeof authHeader !== 'string') return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1].trim()) return null;
  return parts[1];
};

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractBearerToken(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ success: false, error: { code: 'MISSING_TOKEN', message: 'Authentication required' } });
    }

    let decoded: any;
    try {
      decoded = authTokens.verifyAccessToken(token);
    } catch (err: any) {
      const code = err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN';
      return res.status(401).json({ success: false, error: { code, message: 'Authentication failed' } });
    }

    if (decoded.type === 'refresh') {
      logger.warn('Refresh token misused as access token', { userId: decoded.sub, traceId: req.traceId });
      return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Authentication failed' } });
    }

    if (!decoded.type || decoded.type !== 'access') {
      return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Authentication failed' } });
    }

    if (decoded.sessionId) {
      const isValidSession = await authSession.validateSession(decoded.sub, decoded.sessionId);
      if (!isValidSession) {
        logger.warn('Session revoked or invalid', { userId: decoded.sub, sessionId: decoded.sessionId, traceId: req.traceId });
        return res.status(401).json({ success: false, error: { code: 'SESSION_REVOKED', message: 'Authentication failed' } });
      }
    }

    req.user = { id: decoded.sub, role: decoded.role, email: decoded.email, sessionId: decoded.sessionId };
    req.authContext = { traceId: req.traceId, sessionId: decoded.sessionId, userId: decoded.sub };
    next();
  } catch (error) {
    logger.error('Unexpected error in authenticate middleware', { error, traceId: req.traceId });
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication failed' } });
  }
};

export const optionalAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractBearerToken(req.headers.authorization);
    if (!token) return next();

    let decoded: any;
    try {
      decoded = authTokens.verifyAccessToken(token);
    } catch (err) {
      return next();
    }

    if (decoded.type !== 'access') return next();

    if (decoded.sessionId) {
      const isValidSession = await authSession.validateSession(decoded.sub, decoded.sessionId);
      if (!isValidSession) return next();
    }

    req.user = { id: decoded.sub, role: decoded.role, email: decoded.email, sessionId: decoded.sessionId };
    req.authContext = { traceId: req.traceId, sessionId: decoded.sessionId, userId: decoded.sub };
    next();
  } catch (error) {
    next();
  }
};

export const requireAuthenticatedUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
  }
  next();
};

export const requireSession = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.sessionId) {
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Active session required' } });
  }
  next();
};
