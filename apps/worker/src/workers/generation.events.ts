export const WORKER_GENERATION_EVENTS = {
  STARTED: 'generation:started',
  PROGRESS: 'generation:progress',
  COMPLETED: 'generation:completed',
  FAILED: 'generation:failed',
} as const;

export interface WorkerGenerationEventPayload {
  assignmentId: string;
  traceId: string;
  timestamp: string;
  percent?: number;
  message?: string;
  error?: string;
}
