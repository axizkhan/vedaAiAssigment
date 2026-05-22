export class GenerationError extends Error {
  constructor(message: string, public code: string, public statusCode: number = 400) {
    super(message);
    this.name = 'GenerationError';
  }
}

export class GenerationConflictError extends GenerationError {
  constructor(message: string, public jobId?: string) {
    super(message, 'ALREADY_IN_PROGRESS', 409);
  }
}

export class QuotaExceededError extends GenerationError {
  constructor(message: string) {
    super(message, 'DAILY_QUOTA_EXCEEDED', 429);
  }
}

export class GenerationLockError extends GenerationError {
  constructor(message: string) {
    super(message, 'LOCK_ACQUISITION_FAILED', 409); // Treat as conflict
  }
}

export class InvalidGenerationStateError extends GenerationError {
  constructor(message: string) {
    super(message, 'INVALID_GENERATION_STATE', 400);
  }
}
