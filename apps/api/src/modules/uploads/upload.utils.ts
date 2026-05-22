/**
 * Upload utilities and helpers
 */

import { Buffer } from 'buffer';

/**
 * Check if buffer appears to be binary content
 */
export function isBinaryContent(buffer: Buffer, sampleSize: number = 512): boolean {
  const sample = buffer.subarray(0, Math.min(sampleSize, buffer.length));
  let nullBytes = 0;

  for (let i = 0; i < sample.length; i++) {
    if (sample[i] === 0) {
      nullBytes++;
    }
  }

  // If more than 10% null bytes, likely binary
  return nullBytes > sample.length * 0.1;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get MIME type display name
 */
export function getMimeTypeDisplayName(mimeType: string): string {
  const mapping: Record<string, string> = {
    'application/pdf': 'PDF Document',
    'text/plain': 'Text File',
  };

  return mapping[mimeType] || mimeType;
}

/**
 * Validate file extension safety
 */
export function isFilenameRemoteCodeExecution(filename: string): boolean {
  const dangerousPatterns = [
    /\.exe$/i,
    /\.bat$/i,
    /\.cmd$/i,
    /\.sh$/i,
    /\.com$/i,
    /\.pif$/i,
    /\.scr$/i,
    /\.jar$/i,
    /\.zip$/i,
    /\.7z$/i,
    /\.rar$/i,
  ];

  return dangerousPatterns.some((pattern) => pattern.test(filename));
}

/**
 * Create a safe filename for logging
 */
export function sanitizeFilenameForLogging(filename: string, maxLength: number = 100): string {
  let safe = filename.replace(/[^\w\-. ]/g, '_');

  if (safe.length > maxLength) {
    const ext = filename.substring(filename.lastIndexOf('.'));
    safe = safe.substring(0, maxLength - ext.length) + ext;
  }

  return safe;
}
