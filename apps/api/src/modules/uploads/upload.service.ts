import { logger } from "@assessment-ai/logger";
import { AssignmentRepository } from "@assessment-ai/database";
import {
  extractText,
  sanitizeExtractedText,
  estimateTokens,
  truncateContent,
  validateExtractedContext,
  detectPromptInjection,
} from "@assessment-ai/ai";
import { uploadFile } from "@assessment-ai/object-storage";
import { apiEnv } from "@assessment-ai/config";

import { UploadAudit } from "./upload.audit";
import { UploadResponse } from "./upload.types";
import {
  AssignmentNotFoundError,
  AssignmentOwnershipError,
  TextExtractionError,
  FileUpdateError,
  FileUploadStorageError,
} from "./upload.errors";
import { validateExtractedTextNotEmpty } from "./upload.validators";
import { isAssignmentOwner } from "../assignments/assignment.permissions";

export interface UploadServiceInput {
  assignmentId: string;
  file: Express.Multer.File;
  userId: string;
  traceId?: string;
}

class UploadServiceClass {
  private static initialized = false;

  /**
   * Initialize S3 client (call once at startup)
   */
  static initializeStorage(): void {
    if (!this.initialized) {
      // The new S3ClientManager inside the package auto-initializes using env vars.
      this.initialized = true;
      logger.info("Upload service initialized with S3 storage");
    }
  }

  /**
   * Main upload orchestration method
   */
  async uploadAssignmentFile(
    input: UploadServiceInput,
  ): Promise<UploadResponse> {
    const { assignmentId, file, userId, traceId } = input;

    try {
      UploadAudit.uploadInitiated(
        assignmentId,
        userId,
        file.originalname,
        traceId,
      );

      // 1. Validate assignment exists
      const assignment = await this.getAndValidateAssignment(
        assignmentId,
        userId,
        traceId,
      );

      // 2. Upload file to S3/MinIO
      const fileKey = await this.uploadFileToStorage(
        assignmentId,
        file,
        traceId,
      );

      // 3. Extract text from file
      const { extractedText, pageCount, extractionDurationMs } =
        await this.extractAndProcessText(assignmentId, file, traceId);

      // 4. Estimate tokens
      const tokenCount = estimateTokens(extractedText);

      // 5. Update assignment with file metadata
      await this.updateAssignmentWithFileData(
        assignmentId,
        fileKey,
        extractedText,
        tokenCount,
        traceId,
      );

      // 6. Audit log success
      UploadAudit.uploadSuccess(
        assignmentId,
        userId,
        fileKey,
        tokenCount,
        traceId,
      );

      return {
        fileKey,
        extractedText,
        tokenCount,
      };
    } catch (error) {
      logger.error(
        { error, assignmentId, userId, traceId },
        "Upload service error",
      );
      throw error;
    }
  }

  /**
   * Get and validate assignment ownership
   */
  private async getAndValidateAssignment(
    assignmentId: string,
    userId: string,
    traceId?: string,
  ): Promise<any> {
    const assignment =
      await AssignmentRepository.findByIdForGeneration(assignmentId);

    if (!assignment) {
      UploadAudit.validationFailed(
        assignmentId,
        userId,
        "Assignment not found",
        traceId,
      );
      throw new AssignmentNotFoundError();
    }

    if (!isAssignmentOwner(assignment, userId)) {
      UploadAudit.ownershipDenied(assignmentId, userId, traceId);
      throw new AssignmentOwnershipError();
    }

    return assignment;
  }

  /**
   * Upload file to S3/MinIO storage
   */
  private async uploadFileToStorage(
    assignmentId: string,
    file: Express.Multer.File,
    traceId?: string,
  ): Promise<string> {
    try {
      const fileKey = await uploadFile({
        assignmentId,
        userId: "system", // Should ideally be passed down
        filename: file.originalname,
        buffer: file.buffer,
        contentType: file.mimetype,
        metadata: {
          "original-filename": file.originalname,
          "file-size": String(file.size),
        },
        traceId,
      });

      return fileKey;
    } catch (error) {
      logger.error(
        { error, assignmentId, traceId },
        "File upload to storage failed",
      );
      UploadAudit.storageFailed(
        assignmentId,
        "",
        "Failed to upload file to S3/MinIO",
        traceId,
      );
      throw new FileUploadStorageError();
    }
  }

  /**
   * Extract text from file and process it
   */
  private async extractAndProcessText(
    assignmentId: string,
    file: Express.Multer.File,
    traceId?: string
  ): Promise<{
    extractedText: string;
    pageCount?: number;
    extractionDurationMs: number;
  }> {
    UploadAudit.extractionStarted(assignmentId, file.mimetype, traceId);

    try {
      // Extract text based on MIME type
      const extractionResult = await extractText(
        file.buffer,
        file.mimetype,
        traceId,
      );

      // Validate extracted text is not empty
      validateExtractedTextNotEmpty(extractionResult.text, traceId);

      // Sanitize extracted text
      const sanitizationResult = sanitizeExtractedText(
        extractionResult.text,
        traceId,
      );
      let sanitizedText = sanitizationResult.text;

      // Check for prompt injection
      if (sanitizationResult.suspiciousPhrases.length > 0) {
        const injectionResult = detectPromptInjection(
          sanitizationResult.text,
          traceId,
        );
        if (injectionResult.isDetected) {
          UploadAudit.injectionDetected(
            assignmentId,
            injectionResult.riskScore,
            injectionResult.detectedPatterns,
            traceId,
          );
        }
      }

      // Truncate to max length
      const truncationResult = truncateContent(
        sanitizedText,
        undefined,
        traceId,
      );
      sanitizedText = truncationResult.text;

      // Validate final content
      const validationResult = validateExtractedContext(sanitizedText, traceId);
      if (!validationResult.isValid) {
        throw new TextExtractionError(validationResult.errors.join("; "));
      }

      UploadAudit.extractionCompleted(
        assignmentId,
        extractionResult.pageCount,
        sanitizedText.length,
        estimateTokens(sanitizedText),
        traceId,
      );

      return {
        extractedText: sanitizedText,
        pageCount: extractionResult.pageCount,
        extractionDurationMs: extractionResult.extractionDurationMs,
      };
    } catch (error) {
      logger.error({ error, traceId }, "Text extraction and processing failed");
      UploadAudit.extractionFailed(
        assignmentId,
        String(error),
        traceId,
      );
      throw error instanceof TextExtractionError
        ? error
        : new TextExtractionError(
            error instanceof Error ? error.message : "Unknown error",
          );
    }
  }

  /**
   * Update assignment with file metadata
   */
  private async updateAssignmentWithFileData(
    assignmentId: string,
    fileKey: string,
    extractedText: string,
    tokenCount: number,
    traceId?: string,
  ): Promise<void> {
    try {
      const updated = await AssignmentRepository.updateAssignmentRaw(
        assignmentId,
        {
          s3ObjectKey: fileKey,
          extractedText,
          extractedTextTokenCount: tokenCount,
        },
      );

      if (!updated) {
        throw new Error("Failed to update assignment document");
      }

      logger.info(
        { assignmentId, fileKey, tokenCount, traceId },
        "Assignment updated with file metadata",
      );
    } catch (error) {
      logger.error(
        { error, assignmentId, traceId },
        "Failed to update assignment",
      );
      throw new FileUpdateError(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }
}

export const uploadService = new UploadServiceClass();
