import { AppError } from "../../common/errors";

export class UploadError extends AppError {
  constructor(code: string, message: string, statusCode: number = 400) {
    super({
      code,
      message,
      statusCode,
      isOperational: true,
      expose: true,
    });
    this.name = "UploadError";
  }
}

export class FileNotProvidedError extends UploadError {
  constructor() {
    super("FILE_REQUIRED", "No file provided in request", 400);
  }
}

export class FileTooLargeError extends UploadError {
  constructor(maxSizeMB: number) {
    super(
      "FILE_TOO_LARGE",
      `File exceeds maximum allowed size of ${maxSizeMB}MB`,
      413,
    );
  }
}

export class InvalidFileTypeError extends UploadError {
  constructor(providedType: string) {
    super(
      "INVALID_FILE_TYPE",
      `File type not supported: ${providedType}. Only PDF and TXT files are allowed.`,
      400,
    );
  }
}

export class InvalidFileContentError extends UploadError {
  constructor(reason: string) {
    super("INVALID_FILE_CONTENT", `File content is invalid: ${reason}`, 400);
  }
}

export class TextExtractionError extends UploadError {
  constructor(reason: string) {
    super(
      "TEXT_EXTRACTION_FAILED",
      `Failed to extract text from file: ${reason}`,
      500,
    );
  }
}

export class FileUploadStorageError extends UploadError {
  constructor() {
    super("FILE_UPLOAD_FAILED", "Unable to upload file to storage", 500);
  }
}

export class AssignmentNotFoundError extends UploadError {
  constructor() {
    super("ASSIGNMENT_NOT_FOUND", "Assignment not found", 404);
  }
}

export class AssignmentOwnershipError extends UploadError {
  constructor() {
    super(
      "FORBIDDEN",
      "You do not have permission to upload files for this assignment",
      403,
    );
  }
}

export class FileUpdateError extends UploadError {
  constructor(reason: string) {
    super(
      "FILE_UPDATE_FAILED",
      `Failed to update assignment with file metadata: ${reason}`,
      500,
    );
  }
}
