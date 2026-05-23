import { PdfTelemetry } from './pdf.telemetry';
import { PdfMetrics } from './pdf.metrics';

export const PdfRecovery = {
  handleTerminalFailure: async (jobData: any, error: any) => {
    // Determine error type based on error.name (e.g. BrowserLaunchError vs TemplateRenderError)
    const isRetryable = error.name === 'BrowserLaunchError' || error.name === 'ChromiumCrashError';

    PdfMetrics.recordFailure(error.name || 'UnknownError');

    PdfTelemetry.logEvent('pdf_failed', {
      assignmentId: jobData.assignmentId,
      version: jobData.version,
      error: error.message,
      type: error.name,
      traceId: jobData.traceId,
      retryable: isRetryable
    });
    
    // In production, route non-retryable to DLQ immediately, 
    // allow retryable to bubble up to BullMQ
  }
};
