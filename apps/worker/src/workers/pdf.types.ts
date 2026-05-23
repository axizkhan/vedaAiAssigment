export interface PdfJobPayload {
  assignmentId: string;
  version: number;
  requestedBy: string;
  traceId: string;
  requestedAt: string;
}

export interface PdfWorkerConfig {
  concurrency: number;
  lockDuration: number;
}
