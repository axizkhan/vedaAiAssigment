import { logger } from '@assessment-ai/logger';

export const extractionMetrics = {
  trackSuccess: (data: {
    traceId?: string;
    mimeType: string;
    fileSize: number;
    extractedChars: number;
    pageCount?: number;
    extractionDurationMs: number;
  }) => {
    logger.info('Extraction completed', { ...data, success: true });
  },
  trackFailure: (data: {
    traceId?: string;
    mimeType?: string;
    errorType: string;
    errorMessage: string;
    durationMs: number;
  }) => {
    logger.error('Extraction failed', { ...data, success: false });
  }
};
