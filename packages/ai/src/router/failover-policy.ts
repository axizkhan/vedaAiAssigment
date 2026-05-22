import { AIProviderError, AIProviderRateLimitError, AIProviderUnavailableError, AIProviderTimeoutError } from '../providers/provider.errors';

export const shouldFailover = (error: Error): boolean => {
  // Only failover for transient/infrastructure errors
  if (
    error instanceof AIProviderRateLimitError ||
    error instanceof AIProviderUnavailableError ||
    error instanceof AIProviderTimeoutError
  ) {
    return true;
  }

  // Do NOT failover for prompt validation, auth errors, etc.
  return false;
};
