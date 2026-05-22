import { CONTEXT_CONSTANTS } from './context.constants';
import { getContextWindow } from './context-window';

export const calculateAvailableContextTokens = (
  provider?: string,
  model?: string,
  reservedPromptTokens = CONTEXT_CONSTANTS.PROMPT_RESERVED_TOKENS,
  reservedOutputTokens = CONTEXT_CONSTANTS.OUTPUT_RESERVED_TOKENS
): number => {
  const window = getContextWindow(provider, model);
  
  const available = window.maxContextTokens - reservedPromptTokens - reservedOutputTokens;
  
  return Math.max(0, available);
};
