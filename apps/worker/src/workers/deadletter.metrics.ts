import { logger } from '@assessment-ai/logger';
import { FailureClassification } from './deadletter.types';

export const dlqMetrics = {
  trackReceived: (queue: string, originalJobId: string, traceId: string) => {
    logger.info('DLQ job received', { event: 'dlq_received', queue, originalJobId, traceId });
  },
  trackClassified: (classification: FailureClassification, retryable: boolean, traceId: string) => {
    logger.info('DLQ failure classified', { event: 'failure_classified', classification, retryable, traceId });
  },
  trackPersisted: (assignmentId: string, traceId: string) => {
    logger.info('DLQ failure permanently persisted', { event: 'dlq_persisted', assignmentId, traceId });
  },
  trackSpike: (classification: string, count: number, windowStr: string) => {
    logger.warn('DLQ failure spike detected', { event: 'failure_spike_detected', classification, count, window: windowStr });
  },
  trackOutage: (provider: string, count: number) => {
    logger.error('Provider outage detected', { event: 'provider_outage_detected', provider, count });
  },
  trackValidationRegression: (count: number) => {
    logger.warn('Validation regression detected', { event: 'validation_regression_detected', count });
  }
};
