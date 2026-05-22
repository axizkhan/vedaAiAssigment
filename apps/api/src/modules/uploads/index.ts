export { uploadsRouter } from "./upload.routes";
export { uploadService } from "./upload.service";
export { uploadMulter } from "./upload.middleware";

// Types and interfaces
export type { UploadResponse } from "./upload.types";

// Error classes
export {
  UploadError,
  FileNotProvidedError,
  FileTooLargeError,
  InvalidFileTypeError,
  InvalidFileContentError,
  TextExtractionError,
  FileUploadStorageError,
  AssignmentNotFoundError,
  AssignmentOwnershipError,
  FileUpdateError,
} from "./upload.errors";

// Constants
export { UPLOAD_CONFIG, FILE_TYPES, MAGIC_BYTES } from "./upload.constants";
