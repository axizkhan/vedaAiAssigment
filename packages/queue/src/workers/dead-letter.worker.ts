import { Worker } from 'bullmq';
import { redis } from '@assessment-ai/redis';
import { logger } from '@assessment-ai/logger';

export const deadLetterWorker = new Worker('dead-letter', async (job) => {
  logger.warn(`Processing dead letter job ${job.id}`);
}, { connection: redis });
