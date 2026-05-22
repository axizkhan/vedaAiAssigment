import { Queue } from 'bullmq';
import { redisConnection } from '../redis.connection';
import { GenerationJobPayload } from '../queue.types';
import { createExponentialRetry } from '../utils/retry-policy';

export const generationQueue = new Queue<GenerationJobPayload>('generation', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: createExponentialRetry(5000),
    removeOnComplete: {
      count: 100 // Prevent Redis memory explosion
    },
    removeOnFail: {
      count: 500 // Retain failures longer for forensic debugging
    }
  }
});
