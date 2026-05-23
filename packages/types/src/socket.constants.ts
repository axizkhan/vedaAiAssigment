export const SOCKET_EVENTS = {
  // Server -> Client
  GENERATION_STARTED: 'generation:started',
  GENERATION_PROGRESS: 'generation:progress',
  GENERATION_COMPLETED: 'generation:completed',
  GENERATION_FAILED: 'generation:failed',
  PDF_READY: 'pdf:ready',
  QUEUE_POSITION: 'queue:position',
  ERROR: 'error',

  // Client -> Server
  ASSIGNMENT_JOIN: 'assignment:join',
  ASSIGNMENT_LEAVE: 'assignment:leave',
} as const;
