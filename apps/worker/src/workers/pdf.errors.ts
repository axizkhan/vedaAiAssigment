export class PdfWorkerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PdfWorkerError';
  }
}

export class PdfRenderError extends PdfWorkerError {
  constructor(message: string) {
    super(message);
    this.name = 'PdfRenderError';
  }
}
