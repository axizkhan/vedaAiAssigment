import { logger } from '@assessment-ai/logger';
import { RetryTelemetry } from './orchestration.types';

export const emitRetryTelemetry = (telemetry: RetryTelemetry): void => {
  // We emit specific structured telemetry for potential DLQ or analytics ingestion later
  logger.warn('Generation attempt failed, tracking telemetry', {
    event: 'retry_telemetry',
    ...telemetry
  });
};
