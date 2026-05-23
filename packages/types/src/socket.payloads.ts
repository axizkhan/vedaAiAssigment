export interface GenerationStartedPayload {
  assignmentId: string;
  message: string;
  traceId: string;
}

export interface GenerationProgressPayload {
  assignmentId: string;
  step: number;
  percent: number;
  message: string;
  traceId: string;
}

export interface GenerationCompletedPayload {
  assignmentId: string;
  version: number;
  traceId: string;
}

export interface GenerationFailedPayload {
  assignmentId: string;
  message: string;
  traceId: string;
}

export interface PdfReadyPayload {
  assignmentId: string;
  version: number;
  downloadUrl: string;
}

export interface QueuePositionPayload {
  assignmentId: string;
  position: number;
}

export interface SocketErrorPayload {
  code: string;
  message: string;
}

export interface RoomJoinPayload {
  assignmentId: string;
}

export interface RoomLeavePayload {
  assignmentId: string;
}
