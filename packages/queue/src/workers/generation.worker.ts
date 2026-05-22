import { Worker } from 'bullmq';
import { redis } from '@assessment-ai/redis';
import { logger } from '@assessment-ai/logger';
import { AssignmentGenerationService } from '@assessment-ai/database';

export const generationWorker = new Worker('generation', async (job) => {
  logger.info(`Processing generation job ${job.id}`);
  await job.updateProgress(10);
  await new Promise(r => setTimeout(r, 1000));
  await job.updateProgress(100);
  return { success: true };
}, { connection: redis });
