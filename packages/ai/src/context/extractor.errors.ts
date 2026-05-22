export class ExtractorError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'ExtractorError';
  }
}

export class UnsupportedMimeTypeError extends ExtractorError {
  constructor(mimeType: string) {
    super(\`Unsupported MIME type: \${mimeType}\`, 'UNSUPPORTED_MIME_TYPE');
  }
}

export class ExtractionTimeoutError extends ExtractorError {
  constructor(timeoutMs: number) {
    super(\`Extraction timed out after \${timeoutMs}ms\`, 'EXTRACTION_TIMEOUT');
  }
}

export class MalformedPdfError extends ExtractorError {
  constructor(details: string) {
    super(\`Malformed PDF detected: \${details}\`, 'MALFORMED_PDF');
  }
}

export class ExtractionSizeLimitError extends ExtractorError {
  constructor(details: string) {
    super(\`Extraction size limit exceeded: \${details}\`, 'EXTRACTION_SIZE_LIMIT');
  }
}

export class ExtractionSecurityError extends ExtractorError {
  constructor(details: string) {
    super(\`Security violation during extraction: \${details}\`, 'EXTRACTION_SECURITY');
  }
}
