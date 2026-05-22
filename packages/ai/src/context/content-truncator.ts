import { logger } from "@assessment-ai/logger";

export const MAX_EXTRACTED_CONTENT_CHARS = 30000;

export interface TruncationResult {
  text: string;
  wasTruncated: boolean;
  originalLength: number;
  truncatedLength: number;
  truncatedAtChar: number;
}

/**
 * Truncate content to maximum length while preserving sentence boundaries
 * Avoids breaking UTF-8 characters
 */
export function truncateContent(
  text: string,
  maxLength: number = MAX_EXTRACTED_CONTENT_CHARS,
  traceId?: string,
): TruncationResult {
  if (text.length <= maxLength) {
    return {
      text,
      wasTruncated: false,
      originalLength: text.length,
      truncatedLength: text.length,
      truncatedAtChar: text.length,
    };
  }

  // Try to find a clean break point at a sentence boundary
  let truncateAt = maxLength;
  let foundSentenceBoundary = false;

  // Look backwards for sentence endings within the last 500 chars
  // This prevents breaking mid-sentence
  const searchWindow = 500;
  const searchStart = Math.max(0, maxLength - searchWindow);

  for (let i = maxLength - 1; i >= searchStart; i--) {
    const char = text[i];

    // Look for sentence-ending punctuation followed by space
    if ((char === "." || char === "!" || char === "?") && text[i + 1] === " ") {
      truncateAt = i + 1;
      foundSentenceBoundary = true;
      break;
    }

    // Alternative: look for paragraph breaks
    if ((char === "\n" || char === "\r") && text[i + 1] === "\n") {
      truncateAt = i + 1;
      foundSentenceBoundary = true;
      break;
    }
  }

  // If no sentence boundary found, truncate at maxLength but ensure we don't break UTF-8
  if (!foundSentenceBoundary) {
    truncateAt = maxLength;
  }

  // Ensure we don't have incomplete UTF-8 sequences at the end
  // Check if we're in the middle of a multi-byte character
  while (truncateAt > 0) {
    const byte = text.charCodeAt(truncateAt - 1);
    // If this is a continuation byte (10xxxxxx), go back further
    if ((byte & 0xc0) === 0x80) {
      truncateAt--;
    } else {
      break;
    }
  }

  const truncated = text.substring(0, truncateAt).trim();

  logger.info(
    {
      originalLength: text.length,
      truncatedLength: truncated.length,
      maxLength,
      foundSentenceBoundary,
      traceId,
    },
    "Content truncated",
  );

  return {
    text: truncated,
    wasTruncated: true,
    originalLength: text.length,
    truncatedLength: truncated.length,
    truncatedAtChar: truncateAt,
  };
}

/**
 * Check if content exceeds maximum length
 */
export function exceedsMaxLength(
  text: string,
  maxLength: number = MAX_EXTRACTED_CONTENT_CHARS,
): boolean {
  return text.length > maxLength;
}

/**
 * Get content length warning if approaching limit
 */
export function getContentLengthWarning(
  text: string,
  maxLength: number = MAX_EXTRACTED_CONTENT_CHARS,
  warningThreshold: number = 0.9,
): { warning: boolean; percentageUsed: number; remainingChars: number } {
  const percentageUsed = text.length / maxLength;
  const remainingChars = maxLength - text.length;

  return {
    warning: percentageUsed > warningThreshold,
    percentageUsed: Math.round(percentageUsed * 100),
    remainingChars: Math.max(0, remainingChars),
  };
}
