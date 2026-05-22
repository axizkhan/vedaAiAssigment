export interface BaseJobPayload {
  assignmentId: string;
  traceId: string;
}

export interface GenerationJobPayload extends BaseJobPayload {
  userId: string;
  promptVersion: string;
  requestedAt: string;
}

export interface PDFJobPayload extends BaseJobPayload {
  version: number;
  requestedBy: string;
}

export interface DeadLetterJobPayload {
  originalQueue: string;
  originalJobId: string;
  assignmentId?: string;
  traceId: string;
  error: {
    message: string;
    stack?: string;
    code?: string;
  };
  failedAt: string;
  attemptsMade: number;
}

export interface QueueWaitEstimation {
  position: number;
  estimatedWaitMs: number;
}
