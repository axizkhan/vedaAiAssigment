import * as jwt from 'jsonwebtoken';
import { AppSocket } from './socket.types';
import { socketLogger } from './socket.logger';
import { socketMetrics } from './socket.metrics';
import { SocketAuthError } from './socket.errors';

export const socketAuthMiddleware = (socket: AppSocket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers['authorization']?.replace('Bearer ', '');

    if (!token) {
      throw new SocketAuthError('Authentication token missing');
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
    
    // Verify access token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; type?: string; role?: string; sessionId?: string };

    // Prevent refresh tokens from being used for socket connections
    if (decoded.type === 'refresh') {
      throw new SocketAuthError('Refresh tokens are not allowed for WebSocket authentication');
    }

    // Attach to socket data for downstream use
    socket.data = {
      userId: decoded.id,
      role: decoded.role,
      sessionId: decoded.sessionId,
      traceId: \`socket_conn_\${Date.now()}_\${socket.id}\`
    };

    socketLogger.info('Socket authenticated successfully', {
      event: 'socket_connected',
      socketId: socket.id,
      userId: socket.data.userId,
      traceId: socket.data.traceId,
      timestamp: new Date().toISOString()
    });

    socketMetrics.trackConnection();
    next();

  } catch (error: any) {
    socketMetrics.trackAuthFailure(error.message);
    socketLogger.warn('Socket authentication rejected', {
      event: 'auth_failed',
      socketId: socket.id,
      timestamp: new Date().toISOString(),
      error: error.message
    });
    
    next(new Error('Unauthorized')); // Socket.IO uses standard Error objects for middleware rejections
  }
};
