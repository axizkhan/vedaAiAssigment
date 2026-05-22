import { logger } from '@assessment-ai/logger';

export const generationMetrics = {
  trackStarted: (jobId: string, assignmentId: string, traceId: string) => {
    logger.info('Worker generation started', { event: 'generation_started', jobId, assignmentId, traceId });
  },
  trackCompleted: (jobId: string, assignmentId: string, traceId: string, durationMs: number) => {
    logger.info('Worker generation completed', { event: 'generation_completed', jobId, assignmentId, traceId, durationMs });
  },
  trackFailed: (jobId: string, assignmentId: string, traceId: string, error: string, retryable: boolean) => {
    logger.error('Worker generation failed', { event: 'generation_failed', jobId, assignmentId, traceId, error, retryable });
  },
  trackProviderFailover: (traceId: string, fromProvider: string, toProvider: string) => {
    logger.warn('Provider failover executed', { event: 'provider_failover', traceId, fromProvider, toProvider });
  },
  trackValidationFailed: (traceId: string, error: string) => {
    logger.warn('AI Output validation failed', { event: 'validation_failed', traceId, error });
  },
  trackPaperPersisted: (assignmentId: string, traceId: string) => {
    logger.info('Generated paper version persisted', { event: 'paper_persisted', assignmentId, traceId });
  },
  trackDlqRouted: (jobId: string, traceId: string) => {
    logger.error('Generation job routed to DLQ', { event: 'dlq_routed', jobId, traceId });
  }
};
