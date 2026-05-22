import { Worker } from 'bullmq';
import { redis } from '@assessment-ai/redis';
import { logger } from '@assessment-ai/logger';

export const pdfWorker = new Worker('pdf', async (job) => {
  logger.info('Processing PDF job ' + job.id);
  await job.updateProgress(100);
  return { success: true };
}, { connection: redis });
