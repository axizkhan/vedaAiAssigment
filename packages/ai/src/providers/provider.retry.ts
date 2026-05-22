import { PROVIDER_CONSTANTS } from './provider.constants';
import { AIProviderRateLimitError, AIProviderUnavailableError, AIProviderTimeoutError } from './provider.errors';

export const withRetry = async <T>(
  operation: (attempt: number) => Promise<T>,
  maxRetries: number = PROVIDER_CONSTANTS.MAX_RETRIES
): Promise<T> => {
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      return await operation(attempt);
    } catch (error: any) {
      const isRetryable = 
        error instanceof AIProviderRateLimitError ||
        error instanceof AIProviderUnavailableError ||
        error instanceof AIProviderTimeoutError;

      if (!isRetryable || attempt >= maxRetries) {
        throw error;
      }

      attempt++;
      
      let delayMs = Math.min(
        PROVIDER_CONSTANTS.BASE_BACKOFF_MS * Math.pow(2, attempt) + Math.random() * 500,
        PROVIDER_CONSTANTS.MAX_BACKOFF_MS
      );

      // Respect explicit retry-after if provided by RateLimitError
      if (error instanceof AIProviderRateLimitError && error.retryAfterMs) {
        delayMs = Math.max(delayMs, error.retryAfterMs);
      }

      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  throw new Error('Unreachable retry exhaustion');
};
