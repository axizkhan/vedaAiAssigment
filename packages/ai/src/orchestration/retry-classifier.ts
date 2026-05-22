import { AppError } from '@assessment-ai/error';
import { ParserError } from '../parser/parser.errors';

export const isRetryableError = (error: any): boolean => {
  // If the parser explicitly tagged it as retryable (e.g. JSONParseError)
  if (error instanceof ParserError) {
    return error.retryable;
  }

  // Network failures, provider timeouts, 5xx errors from the provider layer
  if (error instanceof AppError) {
    if (error.code === 'PROVIDER_TIMEOUT' || error.code === 'PROVIDER_UNAVAILABLE' || error.code === 'RATE_LIMIT_EXCEEDED') {
      return true;
    }
  }

  // Fallback heuristic for generic network errors
  if (error.message && (error.message.includes('timeout') || error.message.includes('fetch failed'))) {
    return true;
  }

  // Default to false for safety (e.g. schema validations, semantic failures)
  return false;
};
