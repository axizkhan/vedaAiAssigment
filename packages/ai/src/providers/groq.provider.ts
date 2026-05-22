import { AIProvider, RawAIResponse } from './base.provider';
import { logger } from '@assessment-ai/logger';

export class GroqProvider implements AIProvider {
  async generatePaper(input: any): Promise<RawAIResponse> {
    logger.info('Calling Groq API');
    return {
      content: JSON.stringify({ sections: [] }),
      model: 'llama3-70b',
      provider: 'groq',
      usage: { inputTokens: 100, outputTokens: 200 },
      durationMs: 1500
    };
  }
}
