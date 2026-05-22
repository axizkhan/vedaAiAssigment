import { logger } from '@assessment-ai/logger';

export const UploadAudit = {
  uploadStarted: (assignmentId: string, userId: string, filename: string, traceId?: string) => {
    logger.info('Upload started', { assignmentId, userId, filename, traceId });
  },
  uploadCompleted: (assignmentId: string, userId: string, fileKey: string, size: number, durationMs: number, traceId?: string) => {
    logger.info('Upload completed', { assignmentId, userId, fileKey, fileSize: size, uploadDurationMs: durationMs, success: true, traceId });
  },
  uploadFailed: (assignmentId: string, userId: string, error: Error, traceId?: string) => {
    logger.error('Upload failed', { assignmentId, userId, error: error.message, success: false, traceId });
  },
  securityViolation: (assignmentId: string, userId: string, filename: string, reason: string, traceId?: string) => {
    logger.warn('Upload security violation', { assignmentId, userId, filename, reason, traceId });
  },
  extractionStarted: (assignmentId: string, mimetype: string, traceId?: string) => {
    logger.info('Text extraction started', { assignmentId, mimetype, traceId });
  },
  extractionCompleted: (assignmentId: string, pageCount: number, extractedLength: number, tokenCount: number, traceId?: string) => {
    logger.info('Text extraction completed', { assignmentId, pageCount, extractedLength, tokenCount, traceId });
  }
};
