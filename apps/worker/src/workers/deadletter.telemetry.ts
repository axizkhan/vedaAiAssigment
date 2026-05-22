import { logger } from '@assessment-ai/logger';

export const emitDlqTelemetry = (data: {
  originalQueue: string;
  classification: string;
  traceId: string;
  retryable: boolean;
  attemptsMade: number;
}) => {
  logger.info('DLQ Telemetry payload', {
    event: 'dlq_telemetry',
    ...data
  });
};
