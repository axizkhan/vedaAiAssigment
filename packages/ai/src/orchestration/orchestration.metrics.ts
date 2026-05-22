import { logger } from '@assessment-ai/logger';
import { GenerationState } from './orchestration.types';

export const orchestrationMetrics = {
  trackSuccess: (state: GenerationState, durationMs: number) => {
    logger.info('Generation completed successfully', {
      event: 'generation_success',
      traceId: state.traceId,
      assignmentId: state.assignmentId,
      totalAttempts: state.attempts.length,
      durationMs
    });
  },
  trackRetry: (state: GenerationState, attemptNumber: number, delayMs: number, error: string) => {
    logger.warn('Generation failed, retrying', {
      event: 'generation_retry',
      traceId: state.traceId,
      assignmentId: state.assignmentId,
      attemptNumber,
      delayMs,
      error
    });
  },
  trackExhaustion: (state: GenerationState, error: Error) => {
    logger.error('Generation retries exhausted', {
      event: 'generation_exhausted',
      traceId: state.traceId,
      assignmentId: state.assignmentId,
      totalAttempts: state.attempts.length,
      error: error.message
    });
  },
  trackNonRetryable: (state: GenerationState, error: Error) => {
    logger.error('Generation halted due to non-retryable error', {
      event: 'generation_halted',
      traceId: state.traceId,
      assignmentId: state.assignmentId,
      attemptNumber: state.attempts.length,
      error: error.message
    });
  }
};
