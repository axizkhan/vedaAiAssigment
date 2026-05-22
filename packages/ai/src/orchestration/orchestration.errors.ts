export class OrchestrationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'OrchestrationError';
  }
}

export class GenerationRetryExhaustedError extends OrchestrationError {
  constructor(message: string) {
    super(message, 'GENERATION_RETRY_EXHAUSTED');
  }
}

export class GenerationTimeoutError extends OrchestrationError {
  constructor(message: string) {
    super(message, 'GENERATION_TIMEOUT');
  }
}

export class RetryBudgetExceededError extends OrchestrationError {
  constructor(message: string) {
    super(message, 'RETRY_BUDGET_EXCEEDED');
  }
}

export class NonRetryableGenerationError extends OrchestrationError {
  constructor(message: string) {
    super(message, 'NON_RETRYABLE_GENERATION_ERROR');
  }
}

export class ProviderGenerationError extends OrchestrationError {
  constructor(message: string) {
    super(message, 'PROVIDER_GENERATION_ERROR');
  }
}
