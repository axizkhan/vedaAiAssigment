/**
 * Upload security utilities
 */

import { logger } from '@assessment-ai/logger';
import { isFilenameRemoteCodeExecution } from './upload.utils';

export interface SecurityCheckResult {
  passed: boolean;
  risks: string[];
}

/**
 * Perform comprehensive security checks on file
 */
export function performSecurityChecks(
  filename: string,
  buffer: Buffer,
  mimeType: string,
  traceId?: string
): SecurityCheckResult {
  const risks: string[] = [];

  // Check 1: Filename sanity
  if (filename.length > 255) {
    risks.push('Filename is too long');
  }

  if (filename.includes('\0')) {
    risks.push('Filename contains null bytes');
  }

  if (filename.includes('..')) {
    risks.push('Filename contains path traversal attempts');
  }

  // Check 2: RCE prevention
  if (isFilenameRemoteCodeExecution(filename)) {
    risks.push('Filename has executable extension');
  }

  // Check 3: File size sanity
  if (buffer.length === 0) {
    risks.push('File is empty');
  }

  if (buffer.length > 10 * 1024 * 1024) {
    risks.push('File exceeds maximum size');
  }

  // Check 4: MIME type mismatches that suggest spoofing
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) {
    risks.push('Archive file types not supported');
  }

  if (mimeType.includes('executable') || mimeType.includes('script') || mimeType.includes('x-msdos')) {
    risks.push('Executable file types not supported');
  }

  if (risks.length > 0) {
    logger.warn(
      { filename, mimeType, risks, traceId },
      'Security checks failed for uploaded file'
    );
  }

  return {
    passed: risks.length === 0,
    risks,
  };
}

/**
 * Check for polyglot file attacks
 * (e.g., a ZIP file with .pdf extension that contains malicious content)
 */
export function checkForPolyglotAttack(buffer: Buffer, extension: string, traceId?: string): boolean {
  // Common polyglot signatures
  const polyglotSignatures: Record<string, Buffer[]> = {
    '.pdf': [
      Buffer.from([0x50, 0x4b, 0x03, 0x04]), // ZIP signature
      Buffer.from([0x52, 0x61, 0x72, 0x21]), // RAR signature
    ],
    '.txt': [
      Buffer.from([0x50, 0x4b, 0x03, 0x04]), // ZIP signature
      Buffer.from([0x25, 0x50, 0x44, 0x46]), // PDF signature
    ],
  };

  const signatures = polyglotSignatures[extension] || [];

  for (const sig of signatures) {
    if (buffer.subarray(0, sig.length).equals(sig)) {
      logger.warn(
        { extension, signatureDetected: sig.toString('hex'), traceId },
        'Potential polyglot file attack detected'
      );
      return true;
    }
  }

  return false;
}

/**
 * Sanitize file metadata to prevent information disclosure
 */
export function sanitizeMetadata(metadata: Record<string, any>): Record<string, any> {
  const safe: Record<string, any> = {};

  // Only include safe metadata keys
  const allowedKeys = [
    'original-filename',
    'file-size',
    'uploaded-at',
    'uploaded-by-trace',
  ];

  for (const key of allowedKeys) {
    if (key in metadata) {
      // Further sanitize values to prevent injection
      const value = metadata[key];
      if (typeof value === 'string') {
        safe[key] = value.substring(0, 255);
      } else if (typeof value === 'number') {
        safe[key] = value;
      }
    }
  }

  return safe;
}
