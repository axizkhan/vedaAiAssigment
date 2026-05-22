import { Job } from 'bullmq';

export interface GenerationJobPayload {
  assignmentId: string;
  userId: string;
  promptVersion: string;
  traceId: string;
  requestedAt: string;
}

export interface GenerationProgress {
  step: number;
  percent: number;
  message: string;
}

export interface GenerationMetadata {
  model: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  generationDurationMs: number;
  retryCount: number;
  estimatedCost: number;
}

export interface GenerationFailurePayload {
  originalJobId: string;
  assignmentId: string;
  traceId: string;
  error: {
    message: string;
    code?: string;
    stack?: string;
  };
  timestamp: string;
  attemptsMade: number;
}
