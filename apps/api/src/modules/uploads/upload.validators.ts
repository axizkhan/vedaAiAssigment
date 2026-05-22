import { logger } from "@assessment-ai/logger";
import { UPLOAD_CONFIG } from "./upload.constants";
import { validateFileType } from "./upload.mime";
import {
  FileNotProvidedError,
  FileTooLargeError,
  InvalidFileTypeError,
  InvalidFileContentError,
} from "./upload.errors";

export interface FileValidationResult {
  valid: boolean;
  file: Express.Multer.File;
  errors: string[];
}

/**
 * Validate file existence
 */
export function validateFileExists(
  file?: Express.Multer.File,
): Express.Multer.File {
  if (!file) {
    throw new FileNotProvidedError();
  }
  return file;
}

/**
 * Validate file size
 */
export function validateFileSize(
  file: Express.Multer.File,
  traceId?: string,
): void {
  if (!file.buffer || file.buffer.length === 0) {
    throw new InvalidFileContentError("File buffer is empty");
  }

  if (file.buffer.length > UPLOAD_CONFIG.MAX_FILE_SIZE_BYTES) {
    logger.warn(
      {
        fileSize: file.buffer.length,
        maxSize: UPLOAD_CONFIG.MAX_FILE_SIZE_BYTES,
        traceId,
      },
      "File exceeds size limit",
    );
    throw new FileTooLargeError(UPLOAD_CONFIG.MAX_FILE_SIZE_MB);
  }
}

/**
 * Validate file type (MIME, extension, magic bytes)
 */
export function validateFileTypeComprehensive(
  file: Express.Multer.File,
  traceId?: string,
): void {
  const result = validateFileType(
    file.buffer,
    file.originalname,
    file.mimetype,
    traceId,
  );

  if (!result.valid) {
    logger.warn(
      {
        filename: file.originalname,
        mimeType: file.mimetype,
        errors: result.errors,
        traceId,
      },
      "File type validation failed",
    );
    throw new InvalidFileTypeError(file.mimetype);
  }
}

/**
 * Validate non-empty extracted text
 */
export function validateExtractedTextNotEmpty(
  text: string,
  traceId?: string,
): void {
  if (!text || text.trim().length === 0) {
    logger.warn(
      { textLength: text.length, traceId },
      "Extracted text is empty",
    );
    throw new InvalidFileContentError(
      "No text could be extracted from the file",
    );
  }
}

/**
 * Comprehensive file validation
 */
export function validateUploadFile(
  file: Express.Multer.File,
  traceId?: string,
): FileValidationResult {
  const errors: string[] = [];

  try {
    validateFileExists(file);
  } catch (error) {
    errors.push((error as Error).message);
  }

  try {
    validateFileSize(file, traceId);
  } catch (error) {
    errors.push((error as Error).message);
  }

  try {
    validateFileTypeComprehensive(file, traceId);
  } catch (error) {
    errors.push((error as Error).message);
  }

  if (errors.length > 0) {
    logger.info(
      { filename: file.originalname, errors, traceId },
      "File validation failed",
    );
  }

  return {
    valid: errors.length === 0,
    file,
    errors,
  };
}

/**
 * Validate assignment ownership
 */
export function validateAssignmentOwnership(
  createdBy: string,
  userId: string,
  traceId?: string,
): void {
  if (createdBy !== userId) {
    logger.warn(
      { createdBy, userId, traceId },
      "Assignment ownership validation failed",
    );
    throw new Error("Ownership validation failed");
  }
}
