import { AIProvider } from './base.provider';
import { PromptInput, RawAIResponse, ProviderExecutionContext, ProviderHealthResult } from './provider.types';
import { apiEnv } from '@assessment-ai/config';
import { withProviderTimeout } from './provider.timeout';
import { withRetry } from './provider.retry';
import { formatPromptForModel } from './provider.utils';
import { validateProviderResponse } from './provider.validators';
import { AIProviderRateLimitError, AIProviderUnavailableError, AIProviderResponseError } from './provider.errors';

export class OpenRouterProvider implements AIProvider {
  readonly name = 'openrouter';
  
  private readonly baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
  // OpenRouter fallback model
  private readonly model = 'anthropic/claude-3-haiku';

  async generatePaper(input: PromptInput, context?: ProviderExecutionContext): Promise<RawAIResponse> {
    const prompt = formatPromptForModel(input);
    const apiKey = apiEnv.OPENROUTER_API_KEY;

    return withRetry(async (attempt) => {
      const startTime = Date.now();

      const fetchOperation = async (signal: AbortSignal) => {
        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Authorization': \`Bearer \${apiKey}\`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://assessment-ai.com', // Required by OpenRouter
          },
          body: JSON.stringify({
            model: this.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2,
            max_tokens: apiEnv.AI_MAX_TOKENS || 4000,
            response_format: { type: "json_object" }
          }),
          signal
        });

        if (!response.ok) {
          if (response.status === 429) {
            throw new AIProviderRateLimitError(this.name);
          }
          if (response.status >= 500) {
            throw new AIProviderUnavailableError(this.name);
          }
          throw new Error(\`OpenRouter API Error: \${response.statusText}\`);
        }

        const data = await response.json();
        const latencyMs = Date.now() - startTime;

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new AIProviderResponseError(this.name, 'Missing choices in response');
        }

        return validateProviderResponse(this.name, {
          content: data.choices[0].message.content,
          inputTokens: data.usage?.prompt_tokens || 0,
          outputTokens: data.usage?.completion_tokens || 0,
          model: this.model,
          latencyMs,
          finishReason: data.choices[0].finish_reason
        });
      };

      return withProviderTimeout(this.name, fetchOperation, context?.timeoutMs);
    });
  }

  async healthCheck(): Promise<ProviderHealthResult> {
    try {
      const start = Date.now();
      const res = await fetch('https://openrouter.ai/api/v1/models');
      return {
        isHealthy: res.ok,
        latencyMs: Date.now() - start,
        lastChecked: new Date(),
        error: res.ok ? undefined : res.statusText
      };
    } catch (err: any) {
      return { isHealthy: false, latencyMs: 0, lastChecked: new Date(), error: err.message };
    }
  }
}
