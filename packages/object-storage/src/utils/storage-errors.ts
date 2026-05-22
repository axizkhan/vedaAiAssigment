export class StorageError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly statusCode: number = 500,
    readonly isOperational: boolean = true,
  ) {
    super(message);
    this.name = "StorageError";
    Object.setPrototypeOf(this, StorageError.prototype);
    if (typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }
}

export class FileUploadError extends StorageError {
  constructor(message = "File upload failed") {
    super("FILE_UPLOAD_FAILED", message, 500);
  }
}

export class FileTooLargeError extends StorageError {
  constructor(message = "File exceeds maximum allowed size") {
    super("FILE_TOO_LARGE", message, 413);
  }
}

export class InvalidFileTypeError extends StorageError {
  constructor(message = "Invalid file type") {
    super("INVALID_FILE_TYPE", message, 400);
  }
}

export class FileNotFoundError extends StorageError {
  constructor(message = "File not found") {
    super("FILE_NOT_FOUND", message, 404);
  }
}
