import { PROMPT_CONSTANTS } from './prompt.constants';
import { PromptBudgetResult } from './prompt.types';
import { estimateTokens } from './prompt.utils';
import { compressContext } from './prompt-compression';

export const enforceContextBudget = (
  rawContext: string,
  baseTokensRequired: number,
  maxTokens: number = PROMPT_CONSTANTS.GLOBAL_TOKEN_LIMIT
): PromptBudgetResult => {
  if (!rawContext) {
    return { text: '', truncated: false, tokensEstimated: 0, charsUsed: 0 };
  }

  const compressed = compressContext(rawContext);
  const contextTokens = estimateTokens(compressed);

  const availableTokens = maxTokens - baseTokensRequired;

  if (availableTokens <= 0) {
    // Edge case: instructions + schema take up the entire budget.
    return { text: '', truncated: true, tokensEstimated: 0, charsUsed: 0 };
  }

  if (contextTokens <= availableTokens) {
    return {
      text: compressed,
      truncated: false,
      tokensEstimated: contextTokens,
      charsUsed: compressed.length
    };
  }

  // Calculate safe truncation length
  const charsAllowed = availableTokens * PROMPT_CONSTANTS.CHARS_PER_TOKEN_ESTIMATE;
  const truncatedText = compressed.substring(0, charsAllowed) + '\\n\\n[CONTENT TRUNCATED DUE TO LENGTH]';

  return {
    text: truncatedText,
    truncated: true,
    tokensEstimated: estimateTokens(truncatedText),
    charsUsed: truncatedText.length
  };
};
