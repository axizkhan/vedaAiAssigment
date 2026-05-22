import { GenerationJobPayload } from '@assessment-ai/queue';

export interface GenerationLock {
  assignmentId: string;
  traceId: string;
  userId: string;
  timestamp: number;
}

export type GenerationStatus = 'DRAFT' | 'QUEUED' | 'GENERATING' | 'COMPLETED' | 'FAILED';

export interface QueueEstimate {
  position: number | null;
  estimatedWaitMs: number | null;
}

export interface GenerationTriggerResult {
  jobId: string;
  queuePosition: number | null;
  estimatedWaitMs: number | null;
}

export interface GenerationTriggerOptions {
  assignmentId: string;
  userId: string;
  promptVersion?: string;
}
