// Client
export { S3ClientManager, type S3Config } from "./client/s3.client";

// Upload
export {
  uploadFile,
  uploadStream,
  validateObjectExists,
} from "./upload/upload-file";
export type { UploadFileOptions } from "./upload/upload-file";

// Download
export { getSignedDownloadUrl } from "./download/get-signed-url";
export type { GetSignedUrlOptions } from "./download/get-signed-url";

// Utils
export {
  sanitizeObjectName,
  generateObjectKey,
  getFileExtension,
  getBaseName,
} from "./utils/sanitize-object-name";
export {
  StorageError,
  FileUploadError,
  FileTooLargeError,
  InvalidFileTypeError,
  FileNotFoundError,
} from "./utils/storage-errors";
