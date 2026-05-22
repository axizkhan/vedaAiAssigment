import { Queue } from 'bullmq';
import { redisConnection } from '../redis.connection';
import { PDFJobPayload } from '../queue.types';
import { createFixedRetry } from '../utils/retry-policy';

export const pdfQueue = new Queue<PDFJobPayload>('pdf', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 2,
    backoff: createFixedRetry(3000),
    removeOnComplete: {
      count: 100
    },
    removeOnFail: {
      count: 500
    }
  }
});
