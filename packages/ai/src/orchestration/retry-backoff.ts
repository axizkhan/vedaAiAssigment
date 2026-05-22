import { ORCHESTRATION_CONSTANTS } from './orchestration.constants';

/**
 * Calculates exponential backoff with full jitter to prevent thundering herds on provider APIs.
 * delay = random(0, Math.min(maxDelay, baseDelay * 2^attempt))
 */
export const calculateJitteredBackoff = (
  attempt: number,
  baseMs = ORCHESTRATION_CONSTANTS.BACKOFF_BASE_MS,
  maxMs = ORCHESTRATION_CONSTANTS.BACKOFF_MAX_MS
): number => {
  const exponentialDelay = baseMs * Math.pow(2, attempt);
  const boundedDelay = Math.min(exponentialDelay, maxMs);
  
  // Full jitter: random number between 0 and boundedDelay
  return Math.floor(Math.random() * boundedDelay);
};
