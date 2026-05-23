import { Server } from 'socket.io';
import { buildAssignmentRoom, SOCKET_EVENTS } from '@assessment-ai/types/src/socket.constants';
import { 
  GenerationProgressPayload, 
  GenerationStartedPayload, 
  GenerationCompletedPayload, 
  GenerationFailedPayload, 
  PdfReadyPayload, 
  QueuePositionPayload 
} from '@assessment-ai/types/src/socket.payloads';
import { socketLogger } from './socket.logger';
import { socketMetrics } from './socket.metrics';

export class SocketManager {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  private emitToRoom(room: string, event: string, payload: any) {
    this.io.to(room).emit(event, payload);
    socketMetrics.trackEventEmitted(event, room);
    
    // Trace propagation log
    socketLogger.info(\`Emitted \${event}\`, {
      event: 'event_emitted',
      socketId: 'server',
      assignmentId: payload.assignmentId,
      traceId: payload.traceId,
      timestamp: new Date().toISOString()
    });
  }

  public emitGenerationStarted(payload: GenerationStartedPayload) {
    this.emitToRoom(buildAssignmentRoom(payload.assignmentId), SOCKET_EVENTS.GENERATION_STARTED, payload);
  }

  public emitGenerationProgress(payload: GenerationProgressPayload) {
    this.emitToRoom(buildAssignmentRoom(payload.assignmentId), SOCKET_EVENTS.GENERATION_PROGRESS, payload);
  }

  public emitGenerationCompleted(payload: GenerationCompletedPayload) {
    this.emitToRoom(buildAssignmentRoom(payload.assignmentId), SOCKET_EVENTS.GENERATION_COMPLETED, payload);
  }

  public emitGenerationFailed(payload: GenerationFailedPayload) {
    this.emitToRoom(buildAssignmentRoom(payload.assignmentId), SOCKET_EVENTS.GENERATION_FAILED, payload);
  }

  public emitPdfReady(payload: PdfReadyPayload) {
    // We construct a mock traceId for PDF events if not provided, just for logging consistency
    const traceId = (payload as any).traceId || \`pdf_ready_\${payload.assignmentId}\`;
    this.emitToRoom(buildAssignmentRoom(payload.assignmentId), SOCKET_EVENTS.PDF_READY, { ...payload, traceId });
  }

  public emitQueuePosition(payload: QueuePositionPayload) {
    const traceId = (payload as any).traceId || \`queue_pos_\${payload.assignmentId}\`;
    this.emitToRoom(buildAssignmentRoom(payload.assignmentId), SOCKET_EVENTS.QUEUE_POSITION, { ...payload, traceId });
  }
}

// Singleton export
let socketManagerInstance: SocketManager;

export const initSocketManager = (io: Server) => {
  socketManagerInstance = new SocketManager(io);
  return socketManagerInstance;
};

export const getSocketManager = () => {
  if (!socketManagerInstance) throw new Error('SocketManager not initialized');
  return socketManagerInstance;
};
