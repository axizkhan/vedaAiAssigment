import { MAGIC_BYTES, FILE_TYPES, UPLOAD_CONFIG } from "./upload.constants";
import { logger } from "@assessment-ai/logger";

export interface FileTypeValidationResult {
  valid: boolean;
  mimeType: string;
  extension: string;
  errors: string[];
}

/**
 * Validate magic bytes (file signature) for PDF
 */
export function validatePDFMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < MAGIC_BYTES.PDF.length) {
    return false;
  }

  // Check for %PDF signature
  return buffer.subarray(0, MAGIC_BYTES.PDF.length).equals(MAGIC_BYTES.PDF);
}

/**
 * Validate magic bytes for UTF-8 text file
 */
export function validateTXTMagicBytes(buffer: Buffer): boolean {
  // UTF-8 BOM is optional
  if (buffer.length >= MAGIC_BYTES.UTF8_BOM.length) {
    if (
      buffer
        .subarray(0, MAGIC_BYTES.UTF8_BOM.length)
        .equals(MAGIC_BYTES.UTF8_BOM)
    ) {
      return true;
    }
  }

  // For plain text, we just need to validate it's valid UTF-8
  try {
    buffer.toString("utf-8");
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract file extension from filename
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot <= 0) return "";
  return filename.substring(lastDot).toLowerCase();
}

/**
 * Validate MIME type string
 */
export function isAllowedMimeType(mimeType: string): boolean {
  // Remove charset and other parameters
  const baseMimeType = mimeType.split(";")[0].trim().toLowerCase();
  return UPLOAD_CONFIG.ALLOWED_MIME_TYPES.includes(baseMimeType);
}

/**
 * Validate file extension
 */
export function isAllowedExtension(filename: string): boolean {
  const ext = getFileExtension(filename);
  return UPLOAD_CONFIG.ALLOWED_EXTENSIONS.includes(ext);
}

/**
 * Comprehensive file type validation combining MIME, extension, and magic bytes
 */
export function validateFileType(
  buffer: Buffer,
  filename: string,
  declaredMimeType: string,
  traceId?: string,
): FileTypeValidationResult {
  const errors: string[] = [];
  const extension = getFileExtension(filename);
  let detectedMimeType = declaredMimeType;

  // 1. Check extension
  if (!isAllowedExtension(filename)) {
    errors.push(
      `File extension "${extension}" is not allowed. Only .pdf and .txt are supported.`,
    );
  }

  // 2. Check MIME type declaration
  if (!isAllowedMimeType(declaredMimeType)) {
    errors.push(`MIME type "${declaredMimeType}" is not allowed.`);
  }

  // 3. Validate magic bytes and infer actual type
  let inferredMimeType: string | null = null;

  if (validatePDFMagicBytes(buffer)) {
    inferredMimeType = FILE_TYPES.PDF;

    // If extension says TXT but magic bytes say PDF, reject
    if (extension === ".txt") {
      errors.push(
        "File appears to be PDF but has .txt extension (potential MIME spoofing)",
      );
    }
  } else if (validateTXTMagicBytes(buffer)) {
    inferredMimeType = FILE_TYPES.TXT;

    // If extension says PDF but magic bytes say TXT, reject
    if (extension === ".pdf") {
      errors.push(
        "File appears to be TXT but has .pdf extension (potential MIME spoofing)",
      );
    }
  } else {
    errors.push(
      "File format could not be determined or is not a valid PDF or text file",
    );
  }

  // 4. Cross-check declared MIME type with inferred type
  if (inferredMimeType && declaredMimeType.includes(inferredMimeType)) {
    detectedMimeType = inferredMimeType;
  }

  // 5. Special checks for PDF
  if (inferredMimeType === FILE_TYPES.PDF) {
    if (buffer.length < 100) {
      errors.push("PDF file is too small or appears corrupted");
    }

    // Check for common PDF malformations
    const bufferStr = buffer.toString(
      "latin1",
      0,
      Math.min(100, buffer.length),
    );
    if (!bufferStr.includes("%%EOF") && buffer.length > 1000) {
      // Note: Some valid PDFs might not have %%EOF, so this is just a warning
      logger.debug({ traceId }, "PDF missing EOF marker, may be incomplete");
    }
  }

  logger.debug(
    {
      filename,
      extension,
      declaredMimeType,
      inferredMimeType,
      bufferSize: buffer.length,
      validationErrors: errors,
      traceId,
    },
    "File type validation completed",
  );

  return {
    valid: errors.length === 0,
    mimeType: detectedMimeType || FILE_TYPES.TXT,
    extension,
    errors,
  };
}

/**
 * Quick MIME type check (doesn't validate magic bytes)
 */
export function getMimeTypeFromExtension(filename: string): string {
  const ext = getFileExtension(filename).toLowerCase();
  if (ext === ".pdf") return FILE_TYPES.PDF;
  if (ext === ".txt") return FILE_TYPES.TXT;
  return "application/octet-stream";
}
