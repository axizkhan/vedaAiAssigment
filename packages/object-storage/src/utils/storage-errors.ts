export class StorageError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export class StorageUploadError extends StorageError {
  constructor(message: string) {
    super(message, 'STORAGE_UPLOAD_ERROR');
  }
}

export class StorageDownloadError extends StorageError {
  constructor(message: string) {
    super(message, 'STORAGE_DOWNLOAD_ERROR');
  }
}

export class StorageNotFoundError extends StorageError {
  constructor(message: string) {
    super(message, 'STORAGE_NOT_FOUND');
  }
}

export class StoragePermissionError extends StorageError {
  constructor(message: string) {
    super(message, 'STORAGE_PERMISSION_DENIED');
  }
}
