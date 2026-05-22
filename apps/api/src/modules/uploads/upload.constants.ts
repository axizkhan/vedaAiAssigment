/**
 * File upload constants
 */

export const UPLOAD_CONFIG = {
  // File size limits
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024, // 10 MB
  MAX_FILE_SIZE_MB: 10,

  // Allowed MIME types
  ALLOWED_MIME_TYPES: ["application/pdf", "text/plain"],

  // Allowed extensions
  ALLOWED_EXTENSIONS: [".pdf", ".txt"],

  // Text extraction
  MAX_EXTRACTED_TEXT_CHARS: 30000,
  MAX_EXTRACTION_TIMEOUT_MS: 30000,

  // Request timeout
  REQUEST_TIMEOUT_MS: 60000,

  // Multipart parser limits
  FILES_LIMIT: 1,
  FIELDS_LIMIT: 5,
  FILE_SIZE_LIMIT: 10 * 1024 * 1024,
};

/**
 * Magic bytes for file type validation
 */
export const MAGIC_BYTES = {
  PDF: Buffer.from([0x25, 0x50, 0x44, 0x46]), // %PDF
  UTF8_BOM: Buffer.from([0xef, 0xbb, 0xbf]),
} as const;

/**
 * File type detection
 */
export const FILE_TYPES = {
  PDF: "application/pdf",
  TXT: "text/plain",
} as const;

export type AllowedFileType = (typeof FILE_TYPES)[keyof typeof FILE_TYPES];

/**
 * Upload audit events
 */
export enum UploadAuditEvent {
  UPLOAD_INITIATED = "UPLOAD_INITIATED",
  UPLOAD_VALIDATION_FAILED = "UPLOAD_VALIDATION_FAILED",
  UPLOAD_OWNERSHIP_DENIED = "UPLOAD_OWNERSHIP_DENIED",
  UPLOAD_SUCCESS = "UPLOAD_SUCCESS",
  UPLOAD_STORAGE_FAILED = "UPLOAD_STORAGE_FAILED",
  TEXT_EXTRACTION_STARTED = "TEXT_EXTRACTION_STARTED",
  TEXT_EXTRACTION_FAILED = "TEXT_EXTRACTION_FAILED",
  TEXT_EXTRACTION_COMPLETED = "TEXT_EXTRACTION_COMPLETED",
  INJECTION_DETECTED = "INJECTION_DETECTED",
}
