import { AssignmentDoc } from '@assessment-ai/types';
import { AIContextResult, ContextBuildOptions } from './context.types';
import { validateExtractedTextSecurity } from './context.validators';
import { estimateTokens } from './token-estimator';
import { calculateAvailableContextTokens } from './prompt-budget';
import { validateBudgetSafeguards } from './token-budget';
import { compressContextText } from './context-compression';
import { safelyTruncateContext } from './truncation';
import { prioritizeContextRegions } from './context-priority';
import { generateFingerprint } from './context-fingerprint';
import { contextMetrics } from './context.metrics';

export const buildAIContext = (
  assignment: AssignmentDoc,
  options?: ContextBuildOptions
): AIContextResult => {
  const startTime = Date.now();
  const rawText = assignment.extractedText || '';

  try {
    // 1. Initial Security Validation (size, null bytes)
    validateExtractedTextSecurity(rawText);

    // 2. Initial token estimation
    const initialEstimation = estimateTokens(rawText);

    // 3. Coordinate Budget with Provider
    const availableBudgetTokens = calculateAvailableContextTokens(options?.provider, options?.model);

    // If it already fits natively, skip heavy compression
    if (initialEstimation.tokens <= availableBudgetTokens) {
      const fingerprint = generateFingerprint(rawText);
      
      contextMetrics.trackSuccess({
        traceId: options?.traceId,
        assignmentId: options?.assignmentId,
        originalChars: initialEstimation.chars,
        compressedChars: initialEstimation.chars,
        truncatedChars: initialEstimation.chars,
        originalTokens: initialEstimation.tokens,
        finalTokens: initialEstimation.tokens,
        truncationApplied: false,
        compressionApplied: false,
        durationMs: Date.now() - startTime
      });

      return {
        promptContext: rawText,
        originalTokens: initialEstimation.tokens,
        finalTokens: initialEstimation.tokens,
        truncated: false,
        compressed: false,
        fingerprint: fingerprint.hash
      };
    }

    // 4. Compress to save tokens safely without dropping semantic meaning
    const compressionResult = compressContextText(rawText);
    const compressedEstimation = estimateTokens(compressionResult.text);

    let finalText = compressionResult.text;
    let truncated = false;
    let finalTokens = compressedEstimation.tokens;

    // 5. If it STILL overflows after compression, invoke Semantic Truncation
    if (compressedEstimation.tokens > availableBudgetTokens) {
      // Prioritize regions (Future RAG integration point)
      const prioritizedText = prioritizeContextRegions(compressionResult.text);

      const truncationResult = safelyTruncateContext(prioritizedText, availableBudgetTokens);
      finalText = truncationResult.text;
      truncated = truncationResult.truncated;
      
      // Re-estimate after truncation
      finalTokens = estimateTokens(finalText).tokens;
    }

    // 6. Final Safeguard check
    validateBudgetSafeguards(finalTokens, availableBudgetTokens);

    // 7. Fingerprint the final payload
    const fingerprint = generateFingerprint(finalText);

    contextMetrics.trackSuccess({
      traceId: options?.traceId,
      assignmentId: options?.assignmentId,
      originalChars: initialEstimation.chars,
      compressedChars: compressionResult.compressedChars,
      truncatedChars: finalText.length,
      originalTokens: initialEstimation.tokens,
      finalTokens,
      truncationApplied: truncated,
      compressionApplied: true,
      durationMs: Date.now() - startTime
    });

    return {
      promptContext: finalText,
      originalTokens: initialEstimation.tokens,
      finalTokens,
      truncated,
      compressed: true,
      fingerprint: fingerprint.hash
    };

  } catch (error: any) {
    contextMetrics.trackFailure(error, options?.traceId);
    throw error;
  }
};
