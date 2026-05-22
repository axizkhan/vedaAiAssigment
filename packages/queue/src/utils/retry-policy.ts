import { BackoffOptions } from 'bullmq';

export const createExponentialRetry = (delayMs = 5000): BackoffOptions => ({
  type: 'exponential',
  delay: delayMs
});

export const createFixedRetry = (delayMs = 3000): BackoffOptions => ({
  type: 'fixed',
  delay: delayMs
});

// Linear retry usually requires a custom backoff strategy in BullMQ,
// but we can simulate or provide a signature for future custom implementations.
export const createLinearRetry = (delayMs = 2000): BackoffOptions => ({
  // BullMQ doesn't have native 'linear', so we map to fixed for now, 
  // or a custom named strategy if registered on the worker.
  type: 'fixed', 
  delay: delayMs
});
