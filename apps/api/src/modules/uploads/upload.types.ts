import { z } from "zod";
import { UPLOAD_CONFIG } from "./upload.constants";

/**
 * Type definitions for upload requests and responses
 */

export interface UploadFileRequest {
  file: Express.Multer.File;
  assignmentId: string;
  userId: string;
  traceId?: string;
}

export interface UploadResponse {
  fileKey: string;
  extractedText: string;
  tokenCount: number;
}

export interface FileMetadata {
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  uploadedByUserId: string;
}

export interface ExtractionMetadata {
  extractedTextLength: number;
  tokenCount: number;
  pageCount?: number;
  extractionDurationMs: number;
  sanitizationApplied: string[];
  injectionRiskScore: number;
}

/**
 * Zod schemas for validation
 */

export const uploadAssignmentIdSchema = z.object({
  id: z
    .string()
    .min(1)
    .refine((id) => {
      // MongoDB ObjectId validation
      return /^[0-9a-f]{24}$/i.test(id);
    }, "Invalid assignment ID format"),
});

export type UploadAssignmentIdParams = z.infer<typeof uploadAssignmentIdSchema>;
