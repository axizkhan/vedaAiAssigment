import { CONTEXT_CONSTANTS } from './context.constants';
import { TokenEstimateResult } from './context.types';

export const estimateTokens = (text: string): TokenEstimateResult => {
  if (!text) return { tokens: 0, chars: 0 };
  
  // Future: Pluggable tiktoken/provider-specific tokenizer integration goes here.
  // Currently uses the deterministic baseline heuristic:
  const chars = text.length;
  const tokens = Math.ceil(chars / CONTEXT_CONSTANTS.CHARS_PER_TOKEN_ESTIMATE);

  return { tokens, chars };
};

export const tokensToChars = (tokens: number): number => {
  return tokens * CONTEXT_CONSTANTS.CHARS_PER_TOKEN_ESTIMATE;
};
