import { GenerationState, FailureAnalysis } from './orchestration.types';

export const analyzeFailureState = (state: GenerationState): FailureAnalysis => {
  const lastAttempt = state.attempts[state.attempts.length - 1];
  
  if (!lastAttempt || !lastAttempt.error) {
    return { isRetryable: false, reason: 'Unknown failure state' };
  }

  return {
    isRetryable: lastAttempt.error.retryable,
    reason: lastAttempt.error.message
  };
};
