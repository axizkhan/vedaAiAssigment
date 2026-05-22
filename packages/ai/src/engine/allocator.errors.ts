export class AllocatorError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AllocatorError';
  }
}

export class AllocationValidationError extends AllocatorError {
  constructor(message: string) {
    super(message, 'ALLOCATION_VALIDATION_ERROR');
  }
}

export class AllocationNormalizationError extends AllocatorError {
  constructor(message: string) {
    super(message, 'ALLOCATION_NORMALIZATION_ERROR');
  }
}

export class MarkDistributionError extends AllocatorError {
  constructor(message: string) {
    super(message, 'MARK_DISTRIBUTION_ERROR');
  }
}

export class DifficultyDistributionError extends AllocatorError {
  constructor(message: string) {
    super(message, 'DIFFICULTY_DISTRIBUTION_ERROR');
  }
}
