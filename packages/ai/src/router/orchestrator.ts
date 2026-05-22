import { PromptInput, RawAIResponse, ProviderExecutionContext } from '../providers/provider.types';
import { AIProvider } from '../providers/base.provider';
import { GroqProvider } from '../providers/groq.provider';
import { OpenRouterProvider } from '../providers/openrouter.provider';
import { ProviderSelector } from './provider-selector';
import { shouldFailover } from './failover-policy';
import { AllProvidersFailedError } from './orchestrator.errors';
import { orchestratorMetrics } from './orchestrator.metrics';
import { AIProviderError } from '../providers/provider.errors';

export class AIOrchestrator {
  private selector: ProviderSelector;

  constructor(providers?: AIProvider[]) {
    // Default to Groq -> OpenRouter priority
    this.selector = new ProviderSelector(providers || [
      new GroqProvider(),
      new OpenRouterProvider()
    ]);
  }

  async generateWithFallback(
    input: PromptInput,
    context: ProviderExecutionContext
  ): Promise<RawAIResponse> {
    const sequence = this.selector.getProviderSequence();
    const errors: AIProviderError[] = [];

    for (let i = 0; i < sequence.length; i++) {
      const provider = sequence[i];

      try {
        return await provider.generatePaper(input, context);
      } catch (error: any) {
        errors.push(error);

        // Check if we should failover to the next provider
        if (shouldFailover(error) && i < sequence.length - 1) {
          const nextProvider = sequence[i + 1];
          orchestratorMetrics.trackFailover({
            traceId: context.traceId,
            fromProvider: provider.name,
            toProvider: nextProvider.name,
            reason: error.message
          });
          continue;
        }

        // If it's a hard error (e.g. Auth/Validation), don't failover, throw immediately
        throw error;
      }
    }

    orchestratorMetrics.trackExhaustion(context.traceId);
    throw new AllProvidersFailedError(errors);
  }
}

export const globalOrchestrator = new AIOrchestrator();
