import {
  GenerationStartedPayload,
  GenerationProgressPayload,
  GenerationCompletedPayload,
  GenerationFailedPayload,
  PdfReadyPayload,
  QueuePositionPayload,
  SocketErrorPayload,
  RoomJoinPayload,
  RoomLeavePayload
} from './socket.payloads';

export interface ServerToClientEvents {
  'generation:started': (data: GenerationStartedPayload) => void;
  'generation:progress': (data: GenerationProgressPayload) => void;
  'generation:completed': (data: GenerationCompletedPayload) => void;
  'generation:failed': (data: GenerationFailedPayload) => void;
  'pdf:ready': (data: PdfReadyPayload) => void;
  'queue:position': (data: QueuePositionPayload) => void;
  'error': (data: SocketErrorPayload) => void;
}

export interface ClientToServerEvents {
  'assignment:join': (data: RoomJoinPayload) => void;
  'assignment:leave': (data: RoomLeavePayload) => void;
}
