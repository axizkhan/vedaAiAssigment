import { PermanentGenerationError } from './generation.errors';
import { GenerationJobPayload } from './generation.types';

export const validateJobPayload = (payload: GenerationJobPayload): void => {
  if (!payload) {
    throw new PermanentGenerationError('Job payload is missing');
  }
  if (!payload.assignmentId || !payload.userId || !payload.traceId) {
    throw new PermanentGenerationError('Job payload is missing required orchestration fields (assignmentId, userId, traceId)');
  }
};

export const validateAssignmentState = (assignment: any): void => {
  if (!assignment) {
    throw new PermanentGenerationError('Assignment not found in database');
  }
  if (assignment.deletedAt) {
    throw new PermanentGenerationError('Cannot process deleted assignment');
  }
};
