import { Worker, Job } from 'bullmq';
import { logger } from '@assessment-ai/logger';
import { redisConnection } from '../redis.connection';
import { GenerationJobPayload } from '../queue.types';
import { GENERATION_EVENTS } from '../events/generation.events';
import { RetryableQueueError, PermanentQueueError } from '../queue.errors';
import { deadLetterQueue } from '../queues/dead-letter.queue';

// Stubs for external dependencies (to be wired fully in real environment)
const assignmentRepository = {
  updateStatus: async (id: string, status: string) => {},
};
const aiOrchestrator = {
  generateWithRetry: async (input: any) => ({ success: true, paper: {} }),
};
const webSocketEmitter = {
  emit: (event: string, payload: any) => {},
};

export const generationWorker = new Worker<GenerationJobPayload>(
  'generation',
  async (job: Job<GenerationJobPayload>) => {
    const { assignmentId, traceId } = job.data;
    
    logger.info('Generation job started', { jobId: job.id, assignmentId, traceId, attempt: job.attemptsMade + 1 });

    try {
      // Step 1
      await job.updateProgress({ step: 1, percent: 10, message: 'Analyzing assignment details...' });
      webSocketEmitter.emit(GENERATION_EVENTS.PROGRESS, { assignmentId, traceId, timestamp: new Date().toISOString(), percent: 10 });
      await assignmentRepository.updateStatus(assignmentId, 'GENERATING');

      // Step 2 & 3
      await job.updateProgress({ step: 3, percent: 40, message: 'Building structured prompt...' });

      // Step 4
      await job.updateProgress({ step: 4, percent: 60, message: 'Generating questions with AI...' });
      
      // Simulate AI Orchestration
      // const result = await aiOrchestrator.generateWithRetry({ ... });
      
      // Step 5 & 6
      await job.updateProgress({ step: 6, percent: 90, message: 'Storing generated paper...' });
      
      // Step 7
      await job.updateProgress({ step: 7, percent: 100, message: 'Complete!' });
      webSocketEmitter.emit(GENERATION_EVENTS.COMPLETED, { assignmentId, traceId, timestamp: new Date().toISOString(), percent: 100 });
      await assignmentRepository.updateStatus(assignmentId, 'COMPLETED');

      logger.info('Generation job completed', { jobId: job.id, assignmentId, traceId });
      return { success: true, assignmentId };

    } catch (error: any) {
      logger.error('Generation job failed', { jobId: job.id, assignmentId, traceId, error: error.message, stack: error.stack });
      
      webSocketEmitter.emit(GENERATION_EVENTS.FAILED, { assignmentId, traceId, timestamp: new Date().toISOString(), error: error.message });

      // Determine if Permanent or Retryable
      if (error instanceof PermanentQueueError || job.attemptsMade >= (job.opts.attempts || 3) - 1) {
        await assignmentRepository.updateStatus(assignmentId, 'FAILED');
        
        // Ship to DLQ
        await deadLetterQueue.add('permanent-failure', {
          originalQueue: 'generation',
          originalJobId: job.id!,
          assignmentId,
          traceId,
          error: { message: error.message, stack: error.stack, code: error.code },
          failedAt: new Date().toISOString(),
          attemptsMade: job.attemptsMade + 1
        });
        
        throw error; // Will be marked as failed in BullMQ
      }
      
      // Transient failure, throw to let BullMQ retry
      throw new RetryableQueueError(error.message);
    }
  },
  {
    connection: redisConnection,
    concurrency: 2, // Strict limit to prevent provider rate-limits/memory explosions
    lockDuration: 120000, // 2 minutes for long AI jobs
  }
);

generationWorker.on('failed', (job, err) => {
  logger.warn('Worker failed job', { jobId: job?.id, error: err.message });
});
