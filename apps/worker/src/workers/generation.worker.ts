import { Worker, Job } from 'bullmq';
import { redisConnection } from '@assessment-ai/queue/src/redis.connection';
import { deadLetterQueue } from '@assessment-ai/queue/src/queues/dead-letter.queue';
import { GenerationJobPayload } from './generation.types';
import { validateJobPayload, validateAssignmentState } from './generation.validators';
import { emitProgress } from './generation.progress';
import { generationMetrics } from './generation.metrics';
import { auditWorkerEvent } from './generation.audit';
import { emitGenerationTelemetry } from './generation.telemetry';
import { withGenerationTimeout } from './generation.timeout';
import { calculateWaitTime } from './generation.utils';
import { WORKER_GENERATION_EVENTS } from './generation.events';
import { RetryableGenerationError, PermanentGenerationError } from './generation.errors';

// Stubs for external DB/AI logic
const AssignmentRepo = {
  findById: async (id: string) => ({ _id: id, status: 'QUEUED' }),
  updateStatus: async (id: string, status: string) => {}
};
const GeneratedPaperRepo = {
  appendVersion: async (assignmentId: string, data: any) => 'new_version_id'
};
const aiOrchestrator = {
  generateWithRetry: async (input: any) => ({
    paper: {},
    metadata: { inputTokens: 1000, outputTokens: 500, provider: 'groq', model: 'llama-3.3-70b', retryCount: 0 }
  })
};
const webSocketEmitter = { emit: (event: string, payload: any) => {} };

export const generationWorker = new Worker<GenerationJobPayload>(
  'generation',
  async (job: Job<GenerationJobPayload>) => {
    const startTime = Date.now();
    const { assignmentId, traceId, userId, requestedAt } = job.data;

    try {
      // 1. Job Validation
      validateJobPayload(job.data);

      // 2. Assignment Loading & Validation
      const assignment = await AssignmentRepo.findById(assignmentId);
      validateAssignmentState(assignment);

      // 3. Mark Generating
      await AssignmentRepo.updateStatus(assignmentId, 'GENERATING');
      generationMetrics.trackStarted(job.id!, assignmentId, traceId);
      auditWorkerEvent('job_started', traceId, { attempt: job.attemptsMade + 1 });
      
      webSocketEmitter.emit(WORKER_GENERATION_EVENTS.STARTED, { assignmentId, traceId, timestamp: new Date().toISOString() });

      // PROGRESS: Step 0 -> Analyzing
      await emitProgress(job, 0, assignmentId, traceId);

      // PROGRESS: Step 1 -> Reference Material
      await emitProgress(job, 1, assignmentId, traceId);

      // PROGRESS: Step 2 -> Building Prompt
      await emitProgress(job, 2, assignmentId, traceId);

      // PROGRESS: Step 3 -> AI Generation
      await emitProgress(job, 3, assignmentId, traceId);

      // 4. Execute AI Generation with strict 90s timeout wrapper
      const aiResult = await withGenerationTimeout(async () => {
        // AI Orchestrator internally handles semantic validation & parser fallback
        return await aiOrchestrator.generateWithRetry({ assignment });
      });

      // PROGRESS: Step 4 -> Validating Output
      await emitProgress(job, 4, assignmentId, traceId);
      // Validation is actually handled inside generateWithRetry, but we step for UI UX.

      // PROGRESS: Step 5 -> Storing Paper
      await emitProgress(job, 5, assignmentId, traceId);

      // 5. Multi-version persistence
      await GeneratedPaperRepo.appendVersion(assignmentId, {
        paper: aiResult.paper,
        metadata: {
          ...aiResult.metadata,
          generationDurationMs: Date.now() - startTime
        }
      });
      generationMetrics.trackPaperPersisted(assignmentId, traceId);

      // PROGRESS: Step 6 -> Complete
      await emitProgress(job, 6, assignmentId, traceId);

      // 6. Complete
      await AssignmentRepo.updateStatus(assignmentId, 'COMPLETED');
      webSocketEmitter.emit(WORKER_GENERATION_EVENTS.COMPLETED, { assignmentId, traceId, timestamp: new Date().toISOString() });

      const durationMs = Date.now() - startTime;
      generationMetrics.trackCompleted(job.id!, assignmentId, traceId, durationMs);
      
      emitGenerationTelemetry({
        traceId,
        durationMs,
        retryCount: aiResult.metadata.retryCount,
        tokenUsage: { input: aiResult.metadata.inputTokens, output: aiResult.metadata.outputTokens },
        queueWaitTimeMs: calculateWaitTime(requestedAt)
      });

      return { success: true, assignmentId };

    } catch (error: any) {
      const isRetryable = error instanceof RetryableGenerationError || (!error.name.includes('Permanent') && job.attemptsMade < (job.opts.attempts || 3) - 1);
      
      generationMetrics.trackFailed(job.id!, assignmentId, traceId, error.message, isRetryable);
      auditWorkerEvent('job_failed', traceId, { error: error.message, isRetryable });

      if (isRetryable) {
        // Let BullMQ natively backoff and retry
        throw error;
      }

      // TERMINAL FAILURE ROUTING
      await AssignmentRepo.updateStatus(assignmentId, 'FAILED');
      webSocketEmitter.emit(WORKER_GENERATION_EVENTS.FAILED, { assignmentId, traceId, timestamp: new Date().toISOString(), error: error.message });

      // Ship to DLQ for forensics
      await deadLetterQueue.add('failed-generation', {
        originalJobId: job.id!,
        assignmentId,
        traceId,
        error: { message: error.message, stack: error.stack, code: error.code },
        timestamp: new Date().toISOString(),
        attemptsMade: job.attemptsMade + 1
      });
      generationMetrics.trackDlqRouted(job.id!, traceId);

      // Throw final error to BullMQ to mark job cleanly as failed in Redis
      throw new PermanentGenerationError(error.message);
    }
  },
  {
    connection: redisConnection,
    concurrency: 2, // Explicit AI memory/token safety constraint
    lockDuration: 120000 // 120 seconds for long LLM payloads
  }
);
