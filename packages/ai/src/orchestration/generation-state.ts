import { GenerationState, GenerationAttempt } from './orchestration.types';

export const createInitialState = (traceId?: string, assignmentId?: string): GenerationState => {
  return {
    traceId,
    assignmentId,
    attempts: [],
    startTime: Date.now()
  };
};

export const recordAttempt = (
  state: GenerationState,
  attemptNumber: number,
  provider: string,
  latencyMs: number,
  success: boolean,
  error?: any
): GenerationState => {
  const attempt: GenerationAttempt = {
    attemptNumber,
    provider,
    latencyMs,
    success,
    error: error ? {
      code: error.code || 'UNKNOWN',
      message: error.message,
      retryable: error.retryable || false
    } : undefined
  };

  return {
    ...state,
    attempts: [...state.attempts, attempt]
  };
};
