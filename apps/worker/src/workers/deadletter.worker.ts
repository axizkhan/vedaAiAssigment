import { Worker, Job } from 'bullmq';
import { redisConnection } from '@assessment-ai/queue/src/redis.connection';
import { DeadLetterPayload } from './deadletter.types';
import { validateDeadLetterPayload } from './deadletter.validators';
import { classifyFailure, isRetryableFailure } from './deadletter.classifier';
import { aggregateRecentFailures, detectFailureSpike } from './deadletter.analyzer';
import { extractProviderFromError } from './deadletter.utils';
import { FailedGenerationRepo } from './deadletter.repository';
import { dlqMetrics } from './deadletter.metrics';
import { emitDlqTelemetry } from './deadletter.telemetry';
import { auditDlqEvent } from './deadletter.audit';
import { logger } from '@assessment-ai/logger';

export const deadLetterWorker = new Worker<DeadLetterPayload>(
  'dead-letter',
  async (job: Job<DeadLetterPayload>) => {
    const payload = job.data;
    
    try {
      // 1. Validate Payload Integrity
      validateDeadLetterPayload(payload);
      dlqMetrics.trackReceived(payload.originalQueue, payload.originalJobId, payload.traceId);

      // 2. Classify Failure
      const classification = classifyFailure(payload.error.message, payload.error.code);
      const retryable = isRetryableFailure(classification);
      const provider = extractProviderFromError(payload.error.message);
      
      dlqMetrics.trackClassified(classification, retryable, payload.traceId);

      // 3. Persist Forensic Record
      const record = {
        assignmentId: payload.assignmentId,
        originalJobId: payload.originalJobId,
        queue: payload.originalQueue,
        worker: 'generation-worker', // Or extract from payload if present
        traceId: payload.traceId,
        error: payload.error.message,
        stack: payload.error.stack,
        provider,
        attemptsMade: payload.attemptsMade,
        failedAt: payload.timestamp,
        resolved: false,
        retryable,
        classification,
        metadata: {}
      };

      await FailedGenerationRepo.create(record);
      if (payload.assignmentId) {
        dlqMetrics.trackPersisted(payload.assignmentId, payload.traceId);
      }

      // 4. Analyze & Alert
      aggregateRecentFailures(classification, provider);
      detectFailureSpike();

      // 5. Audit & Telemetry
      auditDlqEvent('persisted', payload.traceId, { classification, originalJobId: payload.originalJobId });
      emitDlqTelemetry({
        originalQueue: payload.originalQueue,
        classification,
        traceId: payload.traceId,
        retryable,
        attemptsMade: payload.attemptsMade
      });

      return { processed: true, classification };
      
    } catch (error: any) {
      // CRITICAL: Prevent recursive failure loops.
      // If the DLQ worker itself fails to process the payload (e.g. malformed data or DB down),
      // we log a massive error but we DO NOT throw back to BullMQ.
      // Throwing here would cause an infinite retry storm inside the DLQ itself.
      
      logger.fatal('DLQ WORKER INTERNAL FAILURE: Failed to process dead letter job. Job is being swallowed to prevent infinite loops.', {
        event: 'dlq_internal_failure',
        jobId: job.id,
        traceId: payload?.traceId,
        error: error.message
      });
      
      // Return gracefully so BullMQ marks it as "completed" in the DLQ to stop the loop.
      return { processed: false, reason: 'internal_failure_swallowed' };
    }
  },
  {
    connection: redisConnection,
    concurrency: 1, // Sequential processing guarantees accurate spike detection and anomaly thresholds
    lockDuration: 60000 // 60 seconds
  }
);
