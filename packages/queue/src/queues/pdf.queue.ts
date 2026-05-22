import { Queue } from 'bullmq';
import { redis } from '@assessment-ai/redis';

export const pdfQueue = new Queue('pdf', {
  connection: redis,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: 'fixed', delay: 3000 },
    removeOnComplete: true,
    removeOnFail: true
  }
});
