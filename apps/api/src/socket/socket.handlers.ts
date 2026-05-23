import { Server } from 'socket.io';
import { AppSocket } from './socket.types';
import { handleAssignmentJoin, handleAssignmentLeave } from './socket.rooms';
import { validateAssignmentJoinPayload, validateAssignmentLeavePayload } from './socket.validators';
import { socketLogger } from './socket.logger';
import { socketMetrics } from './socket.metrics';
import { SOCKET_EVENTS } from '@assessment-ai/types/src/socket.constants';

export const registerSocketHandlers = (io: Server) => {
  io.on('connection', (socket: AppSocket) => {
    
    // Assignment Join Logic
    socket.on(SOCKET_EVENTS.ASSIGNMENT_JOIN, async (payload) => {
      try {
        validateAssignmentJoinPayload(payload);
        await handleAssignmentJoin(socket, payload);
      } catch (error: any) {
        socketLogger.error('Payload validation failed for assignment join', {
          event: 'join_validation_failed',
          socketId: socket.id,
          userId: socket.data?.userId,
          traceId: socket.data?.traceId,
          error: error.message,
          timestamp: new Date().toISOString()
        });

        socket.emit(SOCKET_EVENTS.ERROR, {
          code: 'BAD_REQUEST',
          message: error.message
        });
      }
    });

    // Assignment Leave Logic
    socket.on(SOCKET_EVENTS.ASSIGNMENT_LEAVE, async (payload) => {
      try {
        validateAssignmentLeavePayload(payload);
        await handleAssignmentLeave(socket, payload);
      } catch (error: any) {
        // Silently fail on leave validation to prevent event spam
        socketLogger.warn('Payload validation failed for assignment leave', {
          event: 'leave_validation_failed',
          socketId: socket.id,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Disconnect Logic
    socket.on('disconnect', (reason) => {
      socketMetrics.trackDisconnection(reason);
      socketLogger.info('Socket disconnected', {
        event: 'socket_disconnected',
        socketId: socket.id,
        userId: socket.data?.userId,
        traceId: socket.data?.traceId,
        timestamp: new Date().toISOString()
      });
    });
  });
};
