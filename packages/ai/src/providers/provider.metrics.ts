import { logger } from '@assessment-ai/logger';

export const providerMetrics = {
  trackSuccess: (data: {
    traceId: string;
    provider: string;
    model: string;
    assignmentId?: string;
    latencyMs: number;
    inputTokens: number;
    outputTokens: number;
    retryCount: number;
  }) => {
    logger.info('Provider generation successful', { ...data, success: true });
  },
  trackFailure: (data: {
    traceId: string;
    provider: string;
    model: string;
    assignmentId?: string;
    latencyMs: number;
    errorCode?: string;
    errorMessage: string;
    retryCount: number;
  }) => {
    logger.error('Provider generation failed', { ...data, success: false });
  }
};
