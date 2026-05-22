import { logger } from '@assessment-ai/logger';

export const orchestratorMetrics = {
  trackFailover: (data: {
    traceId: string;
    fromProvider: string;
    toProvider: string;
    reason: string;
  }) => {
    logger.warn('AI Provider Failover triggered', { event: 'provider_failover', ...data });
  },
  trackExhaustion: (traceId: string) => {
    logger.error('All AI providers exhausted', { event: 'provider_exhaustion', traceId });
  }
};
