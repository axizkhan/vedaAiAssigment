export const PDF_EVENTS = {
  STARTED: 'pdf:started',
  COMPLETED: 'pdf:completed',
  FAILED: 'pdf:failed',
  READY: 'pdf:ready'
} as const;

export interface PDFEventPayload {
  assignmentId: string;
  traceId: string;
  timestamp: string;
}

export interface PDFReadyPayload extends PDFEventPayload {
  version: number;
  downloadUrl: string;
}
