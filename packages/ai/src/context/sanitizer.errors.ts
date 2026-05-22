export class SanitizerError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'SanitizerError';
  }
}

export class SanitizationError extends SanitizerError {
  constructor(message: string) {
    super(message, 'SANITIZATION_FAILED');
  }
}

export class InjectionDetectedError extends SanitizerError {
  constructor(message: string) {
    super(message, 'INJECTION_DETECTED');
  }
}

export class UnsafeUnicodeError extends SanitizerError {
  constructor(message: string) {
    super(message, 'UNSAFE_UNICODE');
  }
}

export class TruncationError extends SanitizerError {
  constructor(message: string) {
    super(message, 'TRUNCATION_FAILED');
  }
}
