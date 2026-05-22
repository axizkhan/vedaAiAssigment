import { logger } from '@assessment-ai/logger';
import { GenerationState } from './orchestration.types';
import { analyzeFailureState } from './failure-analyzer';

export const captureDeadLetter = (state: GenerationState, finalError: Error): void => {
  const analysis = analyzeFailureState(state);
  
  // This will eventually be replaced by a BullMQ dead-letter queue publish.
  // For now, it logs a highly visible structured event that can be alerted on.
  logger.error('Generation pipeline DEAD LETTER triggered', {
    event: 'generation_dead_letter',
    traceId: state.traceId,
    assignmentId: state.assignmentId,
    totalAttempts: state.attempts.length,
    finalError: finalError.message,
    failureAnalysis: analysis,
    stateSnapshot: state
  });
};
