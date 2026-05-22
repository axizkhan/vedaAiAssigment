import { PromptInput } from '../../providers/provider.types';
import { PromptBuildResult } from '../prompt.types';
import { validatePromptInput } from '../prompt.validators';
import { normalizeAndAllocate } from '../../engine/allocator';
import { buildV1Sections } from './assessment.sections';
import { renderPrompt } from '../prompt-renderer';
import { hardenV1Prompt } from './assessment.security';
import { estimateTokens } from '../prompt.utils';
import { promptMetrics } from '../prompt.metrics';
import { PROMPT_CONSTANTS } from '../prompt.constants';

export const buildAssessmentPrompt = (input: PromptInput, traceId?: string): PromptBuildResult => {
  const startTime = Date.now();

  try {
    // 1. Validate Input
    validatePromptInput(input);

    // 2. Normalize Allocations
    const allocation = normalizeAndAllocate(input.totalQuestions, input.totalMarks, input.difficultyDistribution, traceId);

    // 3. Build Sections (includes compression, budget enforcement, context wrapping)
    const { sections, truncated, charsUsed } = buildV1Sections(input, allocation);

    // 4. Render into strict string
    const rawPrompt = renderPrompt(sections);

    // 5. Apply Security Hardening
    const finalPrompt = hardenV1Prompt(rawPrompt);

    // 6. Final Estimation
    const totalEstimatedTokens = estimateTokens(finalPrompt);

    const metrics = {
      durationMs: Date.now() - startTime,
      inputTokensEstimated: totalEstimatedTokens,
      extractedCharsUsed: charsUsed,
      truncated,
      promptVersion: PROMPT_CONSTANTS.VERSIONS.V1
    };

    promptMetrics.trackBuild({
      traceId,
      promptVersion: PROMPT_CONSTANTS.VERSIONS.V1,
      inputTokensEstimated: totalEstimatedTokens,
      extractedCharsUsed: charsUsed,
      truncated,
      questionCount: input.totalQuestions,
      totalMarks: input.totalMarks,
      durationMs: metrics.durationMs
    });

    return {
      prompt: finalPrompt,
      metrics
    };

  } catch (error: any) {
    promptMetrics.trackFailure(error, traceId);
    throw error;
  }
};
