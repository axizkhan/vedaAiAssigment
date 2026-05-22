import { logger } from "@assessment-ai/logger";
import { estimateTokens } from "./token-estimator";
import { MAX_EXTRACTED_CONTENT_CHARS } from "./content-truncator";

export interface ContextValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    textLength: number;
    tokenCount: number;
    wordCount: number;
  };
}

/**
 * Validate extracted context before using in AI generation
 * Performs comprehensive checks on content quality and safety
 */
export function validateExtractedContext(
  text: string,
  traceId?: string,
): ContextValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if empty
  if (!text || text.trim().length === 0) {
    errors.push("Extracted content is empty");
  }

  // Check size limits
  if (text.length > MAX_EXTRACTED_CONTENT_CHARS) {
    warnings.push(
      `Content exceeds recommended size (${text.length} > ${MAX_EXTRACTED_CONTENT_CHARS} chars)`,
    );
  }

  // Check minimum content
  if (text.trim().length < 10) {
    warnings.push("Content is very short, may not provide enough context");
  }

  // Check for excessive repetition
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length > 0) {
    const uniqueLines = new Set(lines.map((l) => l.trim().substring(0, 50)));
    const repetitionRate = (lines.length - uniqueLines.size) / lines.length;

    if (repetitionRate > 0.5) {
      warnings.push("Content has high repetition, may not be useful");
    }
  }

  // Calculate statistics
  const tokenCount = estimateTokens(text);
  const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;

  logger.info(
    {
      textLength: text.length,
      tokenCount,
      wordCount,
      errorCount: errors.length,
      warningCount: warnings.length,
      traceId,
    },
    "Context validation completed",
  );

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    stats: {
      textLength: text.length,
      tokenCount,
      wordCount,
    },
  };
}

/**
 * Perform quick content safety checks
 * Returns true if content is acceptable for AI processing
 */
export function isContentSafe(text: string): boolean {
  // Check for empty content
  if (!text || text.trim().length === 0) {
    return false;
  }

  // Check for mostly non-ASCII (could indicate encoding issues)
  const asciiChars = text.split("").filter((c) => c.charCodeAt(0) < 128).length;
  const asciiRatio = asciiChars / text.length;

  if (asciiRatio < 0.2 && text.length > 100) {
    // Less than 20% ASCII for large text - suspicious
    return false;
  }

  return true;
}

/**
 * Get content quality score (0-100)
 */
export function getContentQualityScore(text: string): number {
  let score = 50; // Base score

  // Length score
  const length = text.length;
  if (length >= 1000) score += 20;
  else if (length >= 500) score += 15;
  else if (length >= 100) score += 10;
  else if (length < 10) score -= 30;

  // Word count score
  const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
  if (wordCount >= 200) score += 10;
  else if (wordCount < 20) score -= 15;

  // Diversity score (different words)
  const uniqueWords = new Set(text.toLowerCase().split(/\s+/));
  const diversityRatio = uniqueWords.size / (wordCount + 1);
  if (diversityRatio > 0.7) score += 10;
  else if (diversityRatio < 0.3) score -= 10;

  // Paragraph score
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim().length > 0);
  if (paragraphs.length >= 3) score += 10;

  return Math.max(0, Math.min(100, score));
}
