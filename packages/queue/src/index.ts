import { Queue } from 'bullmq';
import { redis } from '@assessment-ai/redis';

export const generationQueue = new Queue('generation', { connection: redis });
