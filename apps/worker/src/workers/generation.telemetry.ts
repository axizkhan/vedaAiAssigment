import { logger } from '@assessment-ai/logger';

export const emitGenerationTelemetry = (data: {
  traceId: string;
  durationMs: number;
  providerLatencyMs?: number;
  retryCount: number;
  tokenUsage?: { input: number; output: number };
  queueWaitTimeMs?: number;
}) => {
  // Prep for OpenTelemetry / Datadog
  logger.info('Generation telemetry payload', {
    event: 'generation_telemetry',
    ...data
  });
};
