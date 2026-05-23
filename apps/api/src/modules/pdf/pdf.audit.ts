// Stub for observability and structured logging
export const PdfAudit = {
  logEvent: (
    eventName: string,
    payload: {
      traceId: string;
      assignmentId?: string;
      version?: number;
      jobId?: string;
      durationMs?: number;
      renderer?: string;
      [key: string]: any;
    }
  ) => {
    // This bridges to @assessment-ai/logger in production
    console.log(`[PDF_AUDIT] ${eventName}`, payload);
  }
};
