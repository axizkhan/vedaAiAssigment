export const STORAGE_CONSTANTS = {
  DEFAULT_SIGNED_URL_EXPIRY: 3600,
  MAX_FILE_SIZE_BYTES: 50 * 1024 * 1024, // 50MB
  ALLOWED_MIME_TYPES: [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  DANGEROUS_EXTENSIONS: ['.exe', '.sh', '.bat', '.js', '.php', '.dll', '.so']
};
