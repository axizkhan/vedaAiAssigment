import { logger } from "@assessment-ai/logger";
import { UploadAuditEvent } from "./upload.constants";

export class UploadAudit {
  static uploadInitiated(
    assignmentId: string,
    userId: string,
    fileName: string,
    traceId?: string,
  ): void {
    logger.info(
      {
        assignmentId,
        userId,
        fileName,
        event: UploadAuditEvent.UPLOAD_INITIATED,
        traceId,
      },
      "Upload initiated",
    );
  }

  static validationFailed(
    assignmentId: string,
    userId: string,
    reason: string,
    traceId?: string,
  ): void {
    logger.warn(
      {
        assignmentId,
        userId,
        reason,
        event: UploadAuditEvent.UPLOAD_VALIDATION_FAILED,
        traceId,
      },
      "Upload validation failed",
    );
  }

  static ownershipDenied(
    assignmentId: string,
    userId: string,
    traceId?: string,
  ): void {
    logger.warn(
      {
        assignmentId,
        userId,
        event: UploadAuditEvent.UPLOAD_OWNERSHIP_DENIED,
        traceId,
      },
      "Upload ownership denied",
    );
  }

  static uploadSuccess(
    assignmentId: string,
    userId: string,
    fileKey: string,
    tokenCount: number,
    traceId?: string,
  ): void {
    logger.info(
      {
        assignmentId,
        userId,
        fileKey,
        tokenCount,
        event: UploadAuditEvent.UPLOAD_SUCCESS,
        traceId,
      },
      "Upload completed successfully",
    );
  }

  static storageFailed(
    assignmentId: string,
    userId: string,
    reason: string,
    traceId?: string,
  ): void {
    logger.error(
      {
        assignmentId,
        userId,
        reason,
        event: UploadAuditEvent.UPLOAD_STORAGE_FAILED,
        traceId,
      },
      "Upload storage failed",
    );
  }

  static extractionStarted(
    assignmentId: string,
    mimeType: string,
    traceId?: string,
  ): void {
    logger.debug(
      {
        assignmentId,
        mimeType,
        event: UploadAuditEvent.TEXT_EXTRACTION_STARTED,
        traceId,
      },
      "Text extraction started",
    );
  }

  static extractionFailed(
    assignmentId: string,
    reason: string,
    traceId?: string,
  ): void {
    logger.error(
      {
        assignmentId,
        reason,
        event: UploadAuditEvent.TEXT_EXTRACTION_FAILED,
        traceId,
      },
      "Text extraction failed",
    );
  }

  static extractionCompleted(
    assignmentId: string,
    pageCount: number | undefined,
    textLength: number,
    tokenCount: number,
    traceId?: string,
  ): void {
    logger.info(
      {
        assignmentId,
        pageCount,
        textLength,
        tokenCount,
        event: UploadAuditEvent.TEXT_EXTRACTION_COMPLETED,
        traceId,
      },
      "Text extraction completed",
    );
  }

  static injectionDetected(
    assignmentId: string,
    riskScore: number,
    patterns: string[],
    traceId?: string,
  ): void {
    logger.warn(
      {
        assignmentId,
        riskScore,
        patterns,
        event: UploadAuditEvent.INJECTION_DETECTED,
        traceId,
      },
      "Potential prompt injection detected in uploaded content",
    );
  }
}
