import { Queue } from 'bullmq';
import { redisConnection } from '../redis.connection';
import { DeadLetterJobPayload } from '../queue.types';

export const deadLetterQueue = new Queue<DeadLetterJobPayload>('dead-letter', {
  connection: redisConnection,
  defaultJobOptions: {
    // DLQ jobs generally do not retry automatically; they await manual intervention or analysis
    attempts: 1, 
    removeOnComplete: {
      count: 1000 // We keep more DLQ records
    },
    removeOnFail: {
      count: 1000
    }
  }
});
