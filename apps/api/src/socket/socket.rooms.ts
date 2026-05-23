import { AppSocket } from './socket.types';
import { assertAuthenticatedSocket, assertAuthorizedAssignmentAccess } from './socket.guard';
import { buildAssignmentRoom, SOCKET_EVENTS } from '@assessment-ai/types/src/socket.constants';
import { socketLogger } from './socket.logger';
import { getSocketManager } from './socket.manager';

// Stub for BullMQ
const generationQueue = {
  getWaiting: async () => [
    { data: { assignmentId: 'mock-1' } },
    { data: { assignmentId: 'mock-2' } }
  ]
};

export const handleAssignmentJoin = async (socket: AppSocket, payload: any) => {
  const { assignmentId } = payload;
  const { userId, traceId } = socket.data;

  try {
    assertAuthenticatedSocket(socket.data);

    // 1. Authorize & Fetch
    const assignment = await assertAuthorizedAssignmentAccess(assignmentId, userId);

    // 2. Join scoped room
    const roomName = buildAssignmentRoom(assignmentId);
    await socket.join(roomName);

    socketLogger.info('Socket joined assignment room', {
      event: 'assignment_joined',
      socketId: socket.id,
      userId,
      assignmentId,
      room: roomName,
      traceId,
      timestamp: new Date().toISOString()
    });

    // 3. Current State Snapshot & Sync
    if (assignment.status === 'QUEUED') {
      const waiting = await generationQueue.getWaiting();
      const position = waiting.findIndex(j => j.data.assignmentId === assignmentId) + 1;
      
      // Emit directly to this specific socket just to sync it up, 
      // instead of broadcasting to the whole room again.
      socket.emit(SOCKET_EVENTS.QUEUE_POSITION, {
        assignmentId,
        position: Math.max(1, position), // Fallback if not found but queued
        traceId
      });

      socketLogger.info('Queue position synced', {
        event: 'queue_position_synced',
        socketId: socket.id,
        assignmentId,
        traceId,
        timestamp: new Date().toISOString()
      });
    } else if (assignment.status === 'GENERATING') {
      socket.emit(SOCKET_EVENTS.GENERATION_PROGRESS, {
        assignmentId,
        step: 1, // Fallback placeholder, would pull real step from redis state
        percent: 10,
        message: 'Resuming generation...',
        traceId
      });
    } else if (assignment.status === 'COMPLETED') {
      socket.emit(SOCKET_EVENTS.GENERATION_COMPLETED, { assignmentId, version: 1, traceId });
    } else if (assignment.status === 'FAILED') {
      socket.emit(SOCKET_EVENTS.GENERATION_FAILED, { assignmentId, message: 'Generation failed', traceId });
    }

  } catch (error: any) {
    socketLogger.warn('Unauthorized room join attempt', {
      event: 'authorization_failed',
      socketId: socket.id,
      userId,
      assignmentId,
      room: buildAssignmentRoom(assignmentId),
      traceId,
      timestamp: new Date().toISOString(),
      error: error.message
    });

    socket.emit(SOCKET_EVENTS.ERROR, {
      code: 'FORBIDDEN',
      message: 'Access denied to this assignment'
    });
  }
};

export const handleAssignmentLeave = async (socket: AppSocket, payload: any) => {
  const { assignmentId } = payload;
  const roomName = buildAssignmentRoom(assignmentId);
  
  await socket.leave(roomName);

  socketLogger.info('Socket left assignment room', {
    event: 'assignment_left',
    socketId: socket.id,
    userId: socket.data.userId,
    assignmentId,
    room: roomName,
    traceId: socket.data.traceId,
    timestamp: new Date().toISOString()
  });
};
