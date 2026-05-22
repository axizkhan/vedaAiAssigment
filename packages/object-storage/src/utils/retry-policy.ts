import { logger } from '@assessment-ai/logger';

export const retryPolicy = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000
): Promise<T> => {
  let attempt = 0;
  while (true) {
    try {
      return await operation();
    } catch (error: any) {
      attempt++;
      
      // Do not retry fatal errors
      if (error.name === 'NoSuchBucket' || error.$metadata?.httpStatusCode === 403 || error.$metadata?.httpStatusCode === 401) {
        throw error;
      }

      if (attempt >= maxRetries) {
        throw error;
      }

      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      logger.warn(\`Storage operation failed. Retrying in \${delay}ms...\`, { attempt, maxRetries, error: error.message });
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
