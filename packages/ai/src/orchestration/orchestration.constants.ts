export const ORCHESTRATION_CONSTANTS = {
  DEFAULT_MAX_ATTEMPTS: 3,
  TIMEOUT_MS: 90000, // 90 seconds hard timeout for entire generation lifecycle
  BACKOFF_BASE_MS: 1000,
  BACKOFF_MAX_MS: 15000,
} as const;
