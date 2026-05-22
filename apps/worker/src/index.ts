import { Worker } from 'bullmq';
import { redis } from '@assessment-ai/redis';
import { logger } from '@assessment-ai/logger';
import { workerEnv } from '@assessment-ai/config';

const worker = new Worker('generation', async (job) => {
  logger.info(`Processing job ${job.id}`);
  logger.info(`Worker configuration loaded for ${workerEnv.NODE_ENV}`);
}, { connection: redis });

logger.info('Worker started');
