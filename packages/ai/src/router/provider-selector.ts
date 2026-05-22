import { AIProvider } from '../providers/base.provider';

export class ProviderSelector {
  constructor(private providers: AIProvider[]) {}

  // Simple static priority for now: Groq -> OpenRouter
  // Can be upgraded to health-based or weighted later without changing orchestrator
  getProviderSequence(): AIProvider[] {
    return this.providers;
  }
}
