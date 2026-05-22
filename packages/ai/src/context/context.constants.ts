export const CONTEXT_CONSTANTS = {
  GLOBAL_MAX_TOKENS: 8000,
  PROMPT_RESERVED_TOKENS: 2500, // Safe margin for instructions, constraints, schema
  OUTPUT_RESERVED_TOKENS: 3000, // Safe margin for the generated JSON response
  CHARS_PER_TOKEN_ESTIMATE: 4,
  MAX_CHAR_LIMIT: 200 * 1024, // 200KB absolute max char extraction to process
} as const;
