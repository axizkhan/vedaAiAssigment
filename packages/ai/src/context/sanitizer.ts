import { SanitizationResult } from './sanitizer.types';
import { sanitizeUnicodeAdvanced } from './unicode-sanitizer';
import { stripHtmlAndXml } from './html-stripper';
import { detectAndRedactInjection } from './prompt-injection-detector';
import { normalizeTextAdvanced } from './text-normalizer';
import { truncateSafely } from './truncation';
import { sanitizationTelemetry } from './sanitizer.metrics';
import { SanitizationError } from './sanitizer.errors';

export const sanitizeExtractedText = (raw: string, traceId?: string): SanitizationResult => {
  const startTime = Date.now();
  const originalLength = raw.length;

  try {
    // 1. Unicode & Control Chars
    const { sanitized: noUnicode, charsRemoved: unicodeCharsRemoved } = sanitizeUnicodeAdvanced(raw);

    // 2. HTML / XML Stripping
    const { sanitized: noHtml, tagsRemoved: htmlTagsRemoved } = stripHtmlAndXml(noUnicode);

    // 3. Prompt Injection Detection
    const injectionResult = detectAndRedactInjection(noHtml);

    // 4. Whitespace Normalization
    const normalized = normalizeTextAdvanced(injectionResult.redactedText);

    // 5. Truncation
    const { truncated, applied: truncationApplied } = truncateSafely(normalized);

    const durationMs = Date.now() - startTime;
    const sanitizedLength = truncated.length;

    const metrics = {
      durationMs,
      originalLength,
      sanitizedLength,
      injectionPatternsDetected: injectionResult.matches.length,
      unicodeCharsRemoved,
      htmlTagsRemoved,
      truncationApplied,
    };

    sanitizationTelemetry.trackSanitization({ ...metrics, traceId });

    return {
      text: truncated,
      metrics
    };
  } catch (error: any) {
    sanitizationTelemetry.trackFailure(error, traceId);
    throw new SanitizationError(error.message);
  }
};
