import { logger } from '@assessment-ai/logger';
import { SanitizationMetrics } from './sanitizer.types';

export const sanitizationTelemetry = {
  trackSanitization: (metrics: SanitizationMetrics & { traceId?: string }) => {
    logger.info('Sanitization completed', metrics);
  },
  trackFailure: (error: Error, traceId?: string) => {
    logger.error('Sanitization failed', { error: error.message, traceId });
  }
};
