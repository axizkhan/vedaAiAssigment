import { PromptInput, RawAIResponse, ProviderExecutionContext, ProviderHealthResult } from './provider.types';

export interface AIProvider {
  readonly name: string;

  generatePaper(
    input: PromptInput,
    context?: ProviderExecutionContext
  ): Promise<RawAIResponse>;

  healthCheck(): Promise<ProviderHealthResult>;
}
