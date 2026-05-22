import { ContextWindow } from './context.types';
import { CONTEXT_CONSTANTS } from './context.constants';

const KNOWN_WINDOWS: Record<string, ContextWindow> = {
  'groq:llama-3.3-70b': { provider: 'groq', model: 'llama-3.3-70b', maxContextTokens: 8192 },
  'openrouter:llama-3.3-70b': { provider: 'openrouter', model: 'llama-3.3-70b', maxContextTokens: 8192 }
};

export const getContextWindow = (provider?: string, model?: string): ContextWindow => {
  if (provider && model) {
    const key = \`\${provider}:\${model}\`;
    if (KNOWN_WINDOWS[key]) {
      return KNOWN_WINDOWS[key];
    }
  }

  // Safe fallback if unknown
  return {
    provider: provider || 'unknown',
    model: model || 'unknown',
    maxContextTokens: CONTEXT_CONSTANTS.GLOBAL_MAX_TOKENS
  };
};
