import { RetryDecision } from './orchestration.types';
import { isRetryableError } from './retry-classifier';
import { calculateJitteredBackoff } from './retry-backoff';
import { validateRetryBudget } from './retry-budget';

export const evaluateRetryPolicy = (
  error: any,
  attemptNumber: number,
  maxAttempts: number
): RetryDecision => {
  // 1. Is the error fundamentally retryable?
  if (!isRetryableError(error)) {
    return { shouldRetry: false, delayMs: 0, reason: 'Error is non-retryable' };
  }

  // 2. Have we exhausted the budget?
  try {
    validateRetryBudget(attemptNumber, maxAttempts);
  } catch (e) {
    return { shouldRetry: false, delayMs: 0, reason: 'Retry budget exhausted' };
  }

  // 3. Calculate backoff
  const delayMs = calculateJitteredBackoff(attemptNumber);
  
  return {
    shouldRetry: true,
    delayMs,
    reason: 'Transient failure detected, retrying with backoff'
  };
};
