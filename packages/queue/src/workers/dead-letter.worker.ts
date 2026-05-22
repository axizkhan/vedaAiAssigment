import { Worker, Job } from 'bullmq';
import { logger } from '@assessment-ai/logger';
import { redisConnection } from '../redis.connection';
import { DeadLetterJobPayload } from '../queue.types';

let recentFailures = 0;
const FAILURE_THRESHOLD = 10;
const FAILURE_WINDOW_MS = 60000; // 1 minute

// Basic sliding window threshold reset
setInterval(() => {
  recentFailures = 0;
}, FAILURE_WINDOW_MS);

export const deadLetterWorker = new Worker<DeadLetterJobPayload>(
  'dead-letter',
  async (job: Job<DeadLetterJobPayload>) => {
    const payload = job.data;

    logger.error('CRITICAL: Job permanently failed and entered DLQ', {
      originalQueue: payload.originalQueue,
      originalJobId: payload.originalJobId,
      traceId: payload.traceId,
      error: payload.error.message,
      attemptsMade: payload.attemptsMade
    });

    recentFailures++;

    if (recentFailures > FAILURE_THRESHOLD) {
      logger.fatal('ALERT: High failure rate detected in queues', {
        event: 'dlq_spike_detected',
        recentFailures,
        threshold: FAILURE_THRESHOLD
      });
      // In the future, this triggers PagerDuty, Slack, or Discord alerts
    }

    return { processed: true };
  },
  {
    connection: redisConnection,
    concurrency: 1, // Process DLQs sequentially to avoid hammering logging/alerting systems
  }
);
