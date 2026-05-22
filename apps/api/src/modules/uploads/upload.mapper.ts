import { UploadResponse } from "./upload.types";

/**
 * Map upload service result to response format
 * Only exposes safe, non-sensitive data
 */
export function mapUploadToResponse(result: {
  fileKey: string;
  extractedText: string;
  tokenCount: number;
}): UploadResponse {
  return {
    fileKey: result.fileKey,
    extractedText: result.extractedText,
    tokenCount: result.tokenCount,
  };
}

/**
 * Sanitize fileKey for client response
 * Ensures no internal storage structure is exposed
 */
export function sanitizeFileKey(fileKey: string): string {
  // Return as-is for now, but this structure is opaque to the client
  // In the future, could return a signed token instead
  return fileKey;
}

/**
 * Truncate extracted text for response if needed
 * Ensures response size is reasonable
 */
export function truncateExtractedTextForResponse(
  text: string,
  maxLength: number = 10000,
): string {
  if (text.length <= maxLength) {
    return text;
  }

  // Truncate and add indication
  return text.substring(0, maxLength) + "\n[...truncated for display...]";
}
