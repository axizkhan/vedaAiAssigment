import { findSafeTruncationIndex } from './semantic-boundary';
import { tokensToChars } from './token-estimator';
import { ContextTruncationError } from './context.errors';

export const safelyTruncateContext = (
  text: string,
  availableTokens: number
): { text: string; truncated: boolean } => {
  if (!text) return { text: '', truncated: false };

  // Calculate the raw character limit based on token heuristic
  const maxCharsAllowed = tokensToChars(availableTokens);

  if (text.length <= maxCharsAllowed) {
    return { text, truncated: false };
  }

  // Find a semantic safe point to slice
  const safeIndex = findSafeTruncationIndex(text, maxCharsAllowed);

  if (safeIndex <= 0) {
    throw new ContextTruncationError('Could not find a safe semantic boundary to truncate the context');
  }

  const truncatedText = text.substring(0, safeIndex).trim() + '\\n\\n[CONTENT TRUNCATED DUE TO LENGTH]';

  return {
    text: truncatedText,
    truncated: true
  };
};
