import { RawAIResponse } from './provider.types';
import { AIProviderResponseError } from './provider.errors';

export const validateProviderResponse = (provider: string, response: any): RawAIResponse => {
  if (!response || typeof response !== 'object') {
    throw new AIProviderResponseError(provider, 'Empty or non-object response');
  }

  if (typeof response.content !== 'string' || !response.content.trim()) {
    throw new AIProviderResponseError(provider, 'Missing or empty string content');
  }

  // Ensure tokens are numbers, even if 0
  const inputTokens = typeof response.inputTokens === 'number' ? response.inputTokens : 0;
  const outputTokens = typeof response.outputTokens === 'number' ? response.outputTokens : 0;

  return {
    content: response.content,
    inputTokens,
    outputTokens,
    model: response.model || 'unknown',
    provider,
    latencyMs: response.latencyMs || 0,
    finishReason: response.finishReason || 'unknown',
  };
};
