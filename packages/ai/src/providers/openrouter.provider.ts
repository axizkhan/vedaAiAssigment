import { AIProvider, RawAIResponse } from './base.provider';
import { logger } from '@assessment-ai/logger';

export class OpenRouterProvider implements AIProvider {
  async generatePaper(input: any): Promise<RawAIResponse> {
    logger.info('Calling OpenRouter API');
    return {
      content: JSON.stringify({ sections: [] }),
      model: 'anthropic/claude-3',
      provider: 'openrouter',
      usage: { inputTokens: 150, outputTokens: 250 },
      durationMs: 2000
    };
  }
}
