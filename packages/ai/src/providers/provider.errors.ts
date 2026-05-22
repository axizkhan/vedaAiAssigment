export class AIProviderError extends Error {
  constructor(message: string, public code: string, public provider: string, public statusCode?: number) {
    super(message);
    this.name = 'AIProviderError';
  }
}

export class AIProviderTimeoutError extends AIProviderError {
  constructor(provider: string, timeoutMs: number) {
    super(\`AI provider timeout after \${timeoutMs}ms\`, 'PROVIDER_TIMEOUT', provider, 504);
  }
}

export class AIProviderRateLimitError extends AIProviderError {
  constructor(provider: string, public retryAfterMs?: number) {
    super('AI provider rate limit exceeded', 'PROVIDER_RATE_LIMIT', provider, 429);
  }
}

export class AIProviderAuthError extends AIProviderError {
  constructor(provider: string) {
    super('AI provider authentication failed', 'PROVIDER_AUTH', provider, 401);
  }
}

export class AIProviderUnavailableError extends AIProviderError {
  constructor(provider: string) {
    super('AI provider unavailable', 'PROVIDER_UNAVAILABLE', provider, 503);
  }
}

export class AIProviderResponseError extends AIProviderError {
  constructor(provider: string, details: string) {
    super(\`AI provider returned malformed response: \${details}\`, 'PROVIDER_RESPONSE_MALFORMED', provider, 502);
  }
}

export class AIFailoverExhaustedError extends Error {
  constructor() {
    super('All AI providers exhausted');
    this.name = 'AIFailoverExhaustedError';
  }
}
