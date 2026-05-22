import { GroqProvider } from '../providers/groq.provider';
import { OpenRouterProvider } from '../providers/openrouter.provider';
import { logger } from '@assessment-ai/logger';

export class AIOrchestrator {
  private groq = new GroqProvider();
  private openrouter = new OpenRouterProvider();

  async generate(input: any) {
    try {
      return await this.groq.generatePaper(input);
    } catch (e) {
      logger.warn('Groq failed, failing over to OpenRouter');
      return await this.openrouter.generatePaper(input);
    }
  }
}
