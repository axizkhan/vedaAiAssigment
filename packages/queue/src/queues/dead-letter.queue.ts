import { Queue } from 'bullmq';
import { redis } from '@assessment-ai/redis';

export const deadLetterQueue = new Queue('dead-letter', { connection: redis });
