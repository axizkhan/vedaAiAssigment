import { FailureClassification, ReplayMetadata, DeadLetterPayload } from './deadletter.types';

export const canReplayFailure = (classification: FailureClassification, attemptsMade: number): boolean => {
  // We do not allow automated replays for structural issues.
  if (classification === 'SCHEMA_VALIDATION' || classification === 'JSON_PARSE_FAILURE') {
    return false;
  }
  // Hard cap to prevent infinite manual replay abuse
  if (attemptsMade > 10) {
    return false;
  }
  return true;
};

export const buildReplayPayload = (payload: DeadLetterPayload): ReplayMetadata => {
  return {
    canReplay: true,
    targetQueue: payload.originalQueue,
    safePayload: {
      assignmentId: payload.assignmentId,
      traceId: payload.traceId,
      // We explicitly drop the old attempts counter to give the job a fresh BullMQ lifecycle
    }
  };
};
