export const GENERATION_CONSTANTS = {
  LOCK_PREFIX: 'lock:assignment:',
  LOCK_TTL_SECONDS: 30, // 30 seconds atomic lock duration
  DEFAULT_PROMPT_VERSION: 'v1',
  DEFAULT_DAILY_QUOTA: parseInt(process.env.AI_GENERATION_LIMIT_PER_DAY || '10', 10),
} as const;
