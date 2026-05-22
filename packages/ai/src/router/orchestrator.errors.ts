import { AIProviderError } from '../providers/provider.errors';

export class OrchestratorError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'OrchestratorError';
  }
}

export class AllProvidersFailedError extends OrchestratorError {
  public providerErrors: AIProviderError[];

  constructor(errors: AIProviderError[]) {
    super('All AI providers failed during generation', 'ALL_PROVIDERS_FAILED');
    this.providerErrors = errors;
  }
}
