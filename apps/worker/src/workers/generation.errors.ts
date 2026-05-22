export class WorkerGenerationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'WorkerGenerationError';
  }
}

export class RetryableGenerationError extends WorkerGenerationError {
  constructor(message: string, code: string = 'RETRYABLE_ERROR') {
    super(message, code);
  }
}

export class PermanentGenerationError extends WorkerGenerationError {
  constructor(message: string, code: string = 'PERMANENT_ERROR') {
    super(message, code);
  }
}

export class ValidationGenerationError extends PermanentGenerationError {
  constructor(message: string) {
    super(message, 'VALIDATION_FAILED');
  }
}

export class ProviderGenerationError extends RetryableGenerationError {
  constructor(message: string) {
    super(message, 'PROVIDER_FAILED');
  }
}

export class GenerationTimeoutError extends RetryableGenerationError {
  constructor(message: string) {
    super(message, 'GENERATION_TIMEOUT');
  }
}
