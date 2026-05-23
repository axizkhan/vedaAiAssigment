export class PdfGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PdfGenerationError';
  }
}

export class PdfNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PdfNotFoundError';
  }
}

export class PdfStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PdfStorageError';
  }
}

export class PdfValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PdfValidationError';
  }
}
