import { ValidatedPaper } from '../parser/parser.types';
import { PromptInput } from '../providers/provider.types';
import { aiOrchestrator } from '../router/orchestrator';
import { parseAIResponse } from '../parser/paper.parser';
import { GenerationRetryOptions, GenerationState } from './orchestration.types';
import { validateRetryOptions } from './orchestration.validators';
import { createInitialState, recordAttempt } from './generation-state';
import { evaluateRetryPolicy } from './retry-policy';
import { executeWithGenerationTimeout } from './generation-timeout';
import { emitRetryTelemetry } from './retry-telemetry';
import { captureDeadLetter } from './dead-letter';
import { orchestrationMetrics } from './orchestration.metrics';
import { sleep } from './orchestration.utils';
import { GenerationRetryExhaustedError, NonRetryableGenerationError } from './orchestration.errors';
import { ParserError } from '../parser/parser.errors';

export const generateWithRetry = async (
  input: PromptInput,
  options?: GenerationRetryOptions
): Promise<ValidatedPaper> => {
  const validatedOptions = validateRetryOptions(options);
  let state: GenerationState = createInitialState(validatedOptions.traceId, validatedOptions.assignmentId);

  const executeGenerationLoop = async (signal: AbortSignal): Promise<ValidatedPaper> => {
    let attemptNumber = 1;
    let lastError: Error | null = null;

    while (attemptNumber <= validatedOptions.maxAttempts) {
      if (signal.aborted) {
        throw new Error('Generation aborted by timeout');
      }

      const attemptStartTime = Date.now();
      let currentProvider = 'unknown';

      try {
        // 1. Hit Provider Orchestrator (handles Groq -> OpenRouter failover natively)
        const rawResponse = await aiOrchestrator.generateWithFallback(input);
        currentProvider = rawResponse.provider; // The fallback orchestrator tells us who succeeded

        // 2. Parser Pipeline (JSON Extract -> Zod -> Business Rules)
        const parseResult = parseAIResponse(rawResponse.content, {
          expectedQuestions: input.totalQuestions,
          expectedMarks: input.totalMarks
        }, {
          traceId: validatedOptions.traceId,
          assignmentId: validatedOptions.assignmentId
        });

        const latencyMs = Date.now() - attemptStartTime;

        if (parseResult.success) {
          state = recordAttempt(state, attemptNumber, currentProvider, latencyMs, true);
          orchestrationMetrics.trackSuccess(state, Date.now() - state.startTime);
          return parseResult.paper;
        } else {
          // Wrap the parser failure in an Error object for uniform handling
          throw new ParserError(parseResult.error.message, parseResult.error.code, parseResult.error.retryable);
        }

      } catch (error: any) {
        const latencyMs = Date.now() - attemptStartTime;
        state = recordAttempt(state, attemptNumber, currentProvider, latencyMs, false, error);
        lastError = error;

        // 3. Classify Failure and Calculate Backoff
        const decision = evaluateRetryPolicy(error, attemptNumber, validatedOptions.maxAttempts);

        if (!decision.shouldRetry) {
          orchestrationMetrics.trackNonRetryable(state, error);
          throw new NonRetryableGenerationError(\`Generation halted: \${decision.reason} - \${error.message}\`);
        }

        emitRetryTelemetry({
          traceId: validatedOptions.traceId,
          attempt: attemptNumber,
          provider: currentProvider,
          latencyMs,
          error: error.message
        });

        orchestrationMetrics.trackRetry(state, attemptNumber, decision.delayMs, error.message);

        // 4. Backoff & Loop
        await sleep(decision.delayMs);
        attemptNumber++;
      }
    }

    // Retries exhausted
    const exhaustionError = new GenerationRetryExhaustedError(\`AI generation failed after \${validatedOptions.maxAttempts} attempts. Last error: \${lastError?.message}\`);
    orchestrationMetrics.trackExhaustion(state, exhaustionError);
    captureDeadLetter(state, exhaustionError);
    throw exhaustionError;
  };

  // Wrap the entire while loop inside a strict timeout
  return executeWithGenerationTimeout(executeGenerationLoop, validatedOptions.timeoutMs);
};
