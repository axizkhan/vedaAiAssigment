import { GenerationError } from './generation.errors';

export const assertGenerationOwnership = (assignmentOwnerId: string, requestUserId: string): void => {
  if (assignmentOwnerId.toString() !== requestUserId.toString()) {
    throw new GenerationError('You do not have permission to generate assessments for this assignment', 'UNAUTHORIZED_GENERATION', 403);
  }
};
