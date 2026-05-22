import { AppError } from '../../core/errors/app.error';

export class UploadError extends AppError {
  constructor(message: string, code: string, statusCode: number = 400) {
    super(message, statusCode, code);
  }
}

export class UploadValidationError extends UploadError {
  constructor(message: string) {
    super(message, 'UPLOAD_VALIDATION_ERROR', 400);
  }
}

export class UploadMimeError extends UploadError {
  constructor(message: string) {
    super(message, 'UPLOAD_MIME_ERROR', 415);
  }
}

export class UploadSizeLimitError extends UploadError {
  constructor(message: string) {
    super(message, 'UPLOAD_SIZE_LIMIT_ERROR', 413);
  }
}

export class UploadStorageError extends UploadError {
  constructor(message: string = 'Failed to upload file to storage') {
    super(message, 'UPLOAD_STORAGE_ERROR', 500);
  }
}

export class UploadSecurityError extends UploadError {
  constructor(message: string) {
    super(message, 'UPLOAD_SECURITY_ERROR', 403);
  }
}

export class UploadTimeoutError extends UploadError {
  constructor(message: string = 'Upload timed out') {
    super(message, 'UPLOAD_TIMEOUT_ERROR', 504);
  }
}
