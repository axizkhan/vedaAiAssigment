export const UPLOAD_CONSTANTS = {
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  MAX_FILE_SIZE_MB: 10,
  UPLOAD_TIMEOUT_MS: 30000, // 30 seconds
  ALLOWED_EXTENSIONS: ['.pdf', '.txt'],
  ALLOWED_MIME_TYPES: {
    PDF: 'application/pdf',
    TXT: 'text/plain',
  }
} as const;
