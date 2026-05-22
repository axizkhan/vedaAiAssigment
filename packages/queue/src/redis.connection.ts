// This acts as an adapter/stub to bridge the conceptual @assessment-ai/redis package
import Redis from 'ioredis';

// In a real environment, this would import the singleton from the workspace package
const getRedisConfig = () => {
  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null, // Required by BullMQ
  };
};

// Shared connection across all queues and workers in this Node process
export const redisConnection = new Redis(getRedisConfig());
