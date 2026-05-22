export class ContextError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'ContextError';
  }
}

export class ContextBudgetExceededError extends ContextError {
  constructor(message: string) {
    super(message, 'CONTEXT_BUDGET_EXCEEDED');
  }
}

export class ContextTruncationError extends ContextError {
  constructor(message: string) {
    super(message, 'CONTEXT_TRUNCATION_ERROR');
  }
}

export class TokenEstimationError extends ContextError {
  constructor(message: string) {
    super(message, 'TOKEN_ESTIMATION_ERROR');
  }
}

export class ContextCompressionError extends ContextError {
  constructor(message: string) {
    super(message, 'CONTEXT_COMPRESSION_ERROR');
  }
}

export class SemanticBoundaryError extends ContextError {
  constructor(message: string) {
    super(message, 'SEMANTIC_BOUNDARY_ERROR');
  }
}
