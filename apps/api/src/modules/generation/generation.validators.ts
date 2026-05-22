import { GenerationConflictError, GenerationError } from './generation.errors';

export const validateGenerationEligibility = (assignment: any): void => {
  if (!assignment) {
    throw new GenerationError('Assignment not found', 'NOT_FOUND', 404);
  }

  if (assignment.deletedAt) {
    throw new GenerationError('Cannot generate assessment for a deleted assignment', 'ASSIGNMENT_DELETED', 400);
  }

  if (!assignment.extractedText || assignment.extractedText.trim() === '') {
    throw new GenerationError('Assignment has no extracted text to generate from', 'MISSING_CONTEXT', 400);
  }

  validateGenerationState(assignment.status);
};

export const validateGenerationState = (status: string): void => {
  const s = status?.toUpperCase();
  if (s === 'QUEUED' || s === 'GENERATING') {
    throw new GenerationConflictError(\`Assignment is currently \${s.toLowerCase()}\`);
  }
};
