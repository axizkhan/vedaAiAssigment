import { logger } from '@assessment-ai/logger';

export const parserMetrics = {
  trackSuccess: (data: {
    traceId?: string;
    assignmentId?: string;
    parserVersion: string;
    questionCount: number;
    totalMarks: number;
    repairApplied: boolean;
    durationMs: number;
  }) => {
    logger.info('Parser success', { event: 'parse_success', success: true, ...data });
  },
  trackFailure: (data: {
    traceId?: string;
    assignmentId?: string;
    parserVersion: string;
    errorCode: string;
    errorMessage: string;
    retryable: boolean;
    durationMs: number;
  }) => {
    logger.warn('Parser failure', { event: 'parse_failure', success: false, ...data });
  }
};
