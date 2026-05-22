import { GenerationRetryOptions } from './orchestration.types';
import { ORCHESTRATION_CONSTANTS } from './orchestration.constants';

export const validateRetryOptions = (options?: GenerationRetryOptions): Required<GenerationRetryOptions> => {
  return {
    maxAttempts: Math.max(1, options?.maxAttempts || ORCHESTRATION_CONSTANTS.DEFAULT_MAX_ATTEMPTS),
    timeoutMs: Math.max(1000, options?.timeoutMs || ORCHESTRATION_CONSTANTS.TIMEOUT_MS),
    traceId: options?.traceId || \`gen-\${Date.now()}\`,
    assignmentId: options?.assignmentId || 'unknown'
  };
};
