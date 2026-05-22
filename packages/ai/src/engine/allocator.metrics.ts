import { logger } from '@assessment-ai/logger';

export const allocatorMetrics = {
  trackSuccess: (data: {
    traceId?: string;
    totalQuestions: number;
    totalMarks: number;
    durationMs: number;
  }) => {
    logger.info('Allocation completed successfully', { event: 'allocation_success', ...data });
  },
  trackFailure: (error: Error, traceId?: string) => {
    logger.error('Allocation failed', { event: 'allocation_failure', error: error.message, traceId });
  }
};
