import { logger } from "@assessment-ai/logger";

/**
 * Estimate token count for text
 * Uses the commonly accepted ~4 characters = 1 token rule as baseline
 * This is suitable for budget estimation and doesn't need to be exact
 */
export function estimateTokens(text: string): number {
  if (!text || text.length === 0) {
    return 0;
  }

  // Baseline: ~4 characters = 1 token
  // This is a reasonable approximation for LLM token counting
  const baselineTokens = Math.ceil(text.length / 4);

  // Adjust for common word patterns
  const words = text.split(/\s+/).filter((w) => w.length > 0);

  // Average English word is ~5 characters
  // Most LLM tokenizers split words into ~1.3 tokens per word on average
  const wordBasedEstimate = Math.ceil(words.length * 1.3);

  // Use the higher estimate to be conservative
  const estimate = Math.max(baselineTokens, wordBasedEstimate);

  return estimate;
}

/**
 * Calculate token cost for given text
 * Useful for budget calculations
 */
export function calculateTokenCost(
  text: string,
  costPerToken: number = 0.001,
): number {
  const tokens = estimateTokens(text);
  return tokens * costPerToken;
}

/**
 * Check if text fits within token budget
 */
export function fitsWithinTokenBudget(
  text: string,
  tokenBudget: number,
): boolean {
  const tokens = estimateTokens(text);
  return tokens <= tokenBudget;
}

/**
 * Get token statistics for text
 */
export function getTokenStats(text: string): {
  estimatedTokens: number;
  textLength: number;
  wordCount: number;
  avgTokensPerWord: number;
  avgCharsPerToken: number;
} {
  const estimatedTokens = estimateTokens(text);
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;

  return {
    estimatedTokens,
    textLength: text.length,
    wordCount,
    avgTokensPerWord: wordCount > 0 ? estimatedTokens / wordCount : 0,
    avgCharsPerToken: estimatedTokens > 0 ? text.length / estimatedTokens : 0,
  };
}
