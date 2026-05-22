import { Server } from 'socket.io';
import { AuthenticatedSocket } from './socket.types';
import { logger } from '@assessment-ai/logger';

class SocketManager {
  private io: Server | null = null;
  private userSockets = new Map<string, Set<string>>();
  private sessionSockets = new Map<string, Set<string>>();

  init(io: Server) {
    this.io = io;
  }

  registerSocket(socket: AuthenticatedSocket) {
    const { userId, sessionId } = socket.data.authContext;
    if (!userId || !sessionId) return;

    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(socket.id);

    if (!this.sessionSockets.has(sessionId)) {
      this.sessionSockets.set(sessionId, new Set());
    }
    this.sessionSockets.get(sessionId)!.add(socket.id);
  }

  removeSocket(socket: AuthenticatedSocket, reason: string) {
    const { userId, sessionId, traceId } = socket.data.authContext || {};
    if (!userId || !sessionId) return;

    this.userSockets.get(userId)?.delete(socket.id);
    if (this.userSockets.get(userId)?.size === 0) {
      this.userSockets.delete(userId);
    }

    this.sessionSockets.get(sessionId)?.delete(socket.id);
    if (this.sessionSockets.get(sessionId)?.size === 0) {
      this.sessionSockets.delete(sessionId);
    }

    logger.info('Socket disconnected', { userId, sessionId, reason, traceId });
  }

  disconnectSessionSockets(sessionId: string) {
    if (!this.io) return;
    const socketIds = this.sessionSockets.get(sessionId);
    if (!socketIds) return;

    socketIds.forEach(socketId => {
      const socket = this.io!.sockets.sockets.get(socketId);
      if (socket) {
        socket.emit('error', { code: 'SOCKET_SESSION_REVOKED', message: 'Session has been revoked' });
        socket.disconnect(true);
      }
    });

    this.sessionSockets.delete(sessionId);
  }

  disconnectUserSockets(userId: string) {
    if (!this.io) return;
    const socketIds = this.userSockets.get(userId);
    if (!socketIds) return;

    socketIds.forEach(socketId => {
      const socket = this.io!.sockets.sockets.get(socketId);
      if (socket) {
        socket.disconnect(true);
      }
    });

    this.userSockets.delete(userId);
  }
}

export const socketManager = new SocketManager();
