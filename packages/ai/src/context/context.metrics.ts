import { logger } from '@assessment-ai/logger';

export const contextMetrics = {
  trackSuccess: (data: {
    traceId?: string;
    assignmentId?: string;
    originalChars: number;
    compressedChars: number;
    truncatedChars: number;
    originalTokens: number;
    finalTokens: number;
    truncationApplied: boolean;
    compressionApplied: boolean;
    durationMs: number;
  }) => {
    logger.info('Context processing completed', {
      event: 'context_processing_success',
      ...data,
      compressionRatio: data.originalChars ? ((data.originalChars - data.compressedChars) / data.originalChars) : 0
    });
  },
  trackFailure: (error: Error, traceId?: string) => {
    logger.error('Context processing failed', { event: 'context_processing_failure', error: error.message, traceId });
  }
};
