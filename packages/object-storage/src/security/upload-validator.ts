import { STORAGE_CONSTANTS } from '../constants/storage.constants';
import { StorageUploadError } from '../utils/storage-errors';

export const validateUploadRequest = (filename: string, mimeType: string, sizeBytes: number) => {
  if (sizeBytes > STORAGE_CONSTANTS.MAX_FILE_SIZE_BYTES) {
    throw new StorageUploadError(\`File exceeds maximum size of \${STORAGE_CONSTANTS.MAX_FILE_SIZE_BYTES} bytes\`);
  }

  if (!STORAGE_CONSTANTS.ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new StorageUploadError(\`MIME type \${mimeType} is not allowed\`);
  }

  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  if (STORAGE_CONSTANTS.DANGEROUS_EXTENSIONS.includes(ext)) {
    throw new StorageUploadError(\`Executable extensions are strictly forbidden\`);
  }
};
