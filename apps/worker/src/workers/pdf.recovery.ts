import { PdfTelemetry } from './pdf.telemetry';

export const PdfRecovery = {
  handleTerminalFailure: async (jobData: any, error: any) => {
    // Route to DLQ (Dead Letter Queue)
    PdfTelemetry.logEvent('pdf_failed', {
      assignmentId: jobData.assignmentId,
      version: jobData.version,
      error: error.message,
      traceId: jobData.traceId
    });
  }
};
