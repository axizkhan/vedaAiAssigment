export class PromptError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'PromptError';
  }
}

export class PromptValidationError extends PromptError {
  constructor(message: string) {
    super(message, 'PROMPT_VALIDATION_ERROR');
  }
}

export class PromptBudgetExceededError extends PromptError {
  constructor(message: string) {
    super(message, 'PROMPT_BUDGET_EXCEEDED_ERROR');
  }
}

export class PromptInjectionError extends PromptError {
  constructor(message: string) {
    super(message, 'PROMPT_INJECTION_ERROR');
  }
}

export class PromptSchemaError extends PromptError {
  constructor(message: string) {
    super(message, 'PROMPT_SCHEMA_ERROR');
  }
}

export class PromptBuildError extends PromptError {
  constructor(message: string) {
    super(message, 'PROMPT_BUILD_ERROR');
  }
}
