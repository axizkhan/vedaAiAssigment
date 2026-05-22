import { logger } from "@assessment-ai/logger";
import { AssignmentRepository } from "@assessment-ai/database";
import {
  estimateTokens,
} from "@assessment-ai/ai";
import { streamObject } from "@assessment-ai/object-storage";
import { sanitizeExtractedText } from "./upload.security";
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

      // 2. Extract key from multer-s3
      const fileKey = (file as any).key;
      if (!fileKey) {
        throw new FileUploadStorageError("File key missing from multer-s3");
      }

      // 3. Extract text from file directly from S3 stream
      const { extractedText, pageCount, extractionDurationMs } =
        await this.extractAndProcessText(assignmentId, fileKey, file.mimetype, traceId);

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
   * (Removed manual upload since multer-s3 handles it)
   */

  /**
   * Extract text from file and process it
   */
  private async extractAndProcessText(
    assignmentId: string,
    fileKey: string,
    mimetype: string,
    traceId?: string
  ): Promise<{
    extractedText: string;
    pageCount?: number;
    extractionDurationMs: number;
  }> {
    UploadAudit.extractionStarted(assignmentId, mimetype, traceId);
    const startTime = Date.now();

    try {
      // Stream file back from S3
      const stream = await streamObject(fileKey, traceId);
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      let extractedText = "";
      
      // Extraction with 15s timeout
      const extractionPromise = async () => {
        if (mimetype === 'text/plain') {
          return buffer.toString('utf-8');
        } else if (mimetype === 'application/pdf') {
          const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
          const loadingTask = pdfjs.getDocument({ data: buffer });
          const pdfDocument = await loadingTask.promise;
          let text = "";
          for (let i = 1; i <= pdfDocument.numPages; i++) {
            const page = await pdfDocument.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((item: any) => item.str).join(" ") + " ";
          }
          return text;
        }
        throw new Error('Unsupported mime type for extraction');
      };

      const timeoutPromise = new Promise<string>((_, reject) => 
        setTimeout(() => reject(new Error('Extraction timed out')), 15000)
      );

      extractedText = await Promise.race([extractionPromise(), timeoutPromise]);

      validateExtractedTextNotEmpty(extractedText, traceId);

      // Sanitize and limit to 30000 chars
      const sanitizedText = sanitizeExtractedText(extractedText, traceId);

      UploadAudit.extractionCompleted(
        assignmentId,
        0,
        sanitizedText.length,
        estimateTokens(sanitizedText),
        traceId,
      );

      return {
        extractedText: sanitizedText,
        pageCount: 0,
        extractionDurationMs: Date.now() - startTime,
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
