import crypto from 'crypto';
import { authTokens } from '../modules/auth/auth.tokens';
import { authSession } from '../modules/auth/auth.session';
import { logger } from '@assessment-ai/logger';
import { SocketError, SocketErrorCode } from './socket.errors';
import { AuthenticatedSocket } from './socket.types';

export const authenticateSocket = async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
  const traceId = crypto.randomUUID();
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new SocketError(SocketErrorCode.SOCKET_UNAUTHORIZED));
  }

  try {
    const decoded = authTokens.verifyAccessToken(token);

    if (decoded.type === 'refresh') {
      logger.error('Refresh token misused in websocket auth', { userId: decoded.sub, traceId });
      return next(new SocketError(SocketErrorCode.SOCKET_INVALID_TOKEN));
    }

    if (!decoded.type || decoded.type !== 'access' || !decoded.sessionId) {
      return next(new SocketError(SocketErrorCode.SOCKET_INVALID_TOKEN));
    }

    const isValidSession = await authSession.validateSession(decoded.sub, decoded.sessionId);
    if (!isValidSession) {
      logger.warn('Revoked session websocket attempt', { userId: decoded.sub, sessionId: decoded.sessionId, traceId });
      return next(new SocketError(SocketErrorCode.SOCKET_SESSION_REVOKED));
    }

    socket.data.user = {
      id: decoded.sub,
      role: decoded.role,
      email: decoded.email,
      sessionId: decoded.sessionId
    };

    socket.data.authContext = {
      traceId,
      sessionId: decoded.sessionId,
      userId: decoded.sub,
      connectedAt: new Date(),
      ipAddress: socket.handshake.address
    };

    logger.info('Websocket authenticated', { userId: decoded.sub, sessionId: decoded.sessionId, traceId });
    next();
  } catch (error: any) {
    const code = error.name === 'TokenExpiredError' ? SocketErrorCode.SOCKET_TOKEN_EXPIRED : SocketErrorCode.SOCKET_INVALID_TOKEN;
    return next(new SocketError(code));
  }
};
