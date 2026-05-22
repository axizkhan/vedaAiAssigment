export const GENERATION_EVENTS = {
  STARTED: 'generation:started',
  PROGRESS: 'generation:progress',
  COMPLETED: 'generation:completed',
  FAILED: 'generation:failed',
  QUEUE_POSITION_UPDATED: 'generation:queue_position_updated'
} as const;

export interface GenerationEventPayload {
  assignmentId: string;
  traceId: string;
  timestamp: string;
  // Optional extensions depending on event
  percent?: number;
  message?: string;
  position?: number;
  estimatedWaitMs?: number;
  error?: string;
}
