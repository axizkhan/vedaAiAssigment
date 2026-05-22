import { Queue } from 'bullmq';
import { redis } from '@assessment-ai/redis';

export const generationQueue = new Queue('generation', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: true,
    removeOnFail: true
  }
});
