import { ALLOCATOR_CONSTANTS } from './allocator.constants';
import { AllocationValidationError } from './allocator.errors';
import { DifficultyDistribution } from './allocator.types';

export const validateAllocationInput = (totalQuestions: number, totalMarks: number, dist: DifficultyDistribution): void => {
  if (!Number.isInteger(totalQuestions) || totalQuestions <= 0 || totalQuestions > ALLOCATOR_CONSTANTS.MAX_TOTAL_QUESTIONS) {
    throw new AllocationValidationError(\`totalQuestions must be an integer between 1 and \${ALLOCATOR_CONSTANTS.MAX_TOTAL_QUESTIONS}\`);
  }

  if (!Number.isInteger(totalMarks) || totalMarks <= 0 || totalMarks > ALLOCATOR_CONSTANTS.MAX_TOTAL_MARKS) {
    throw new AllocationValidationError(\`totalMarks must be an integer between 1 and \${ALLOCATOR_CONSTANTS.MAX_TOTAL_MARKS}\`);
  }

  if (totalMarks < totalQuestions) {
    throw new AllocationValidationError(\`totalMarks (\${totalMarks}) cannot be less than totalQuestions (\${totalQuestions})\`);
  }

  const { easy, medium, hard } = dist;
  if (easy < 0 || medium < 0 || hard < 0 || Number.isNaN(easy) || Number.isNaN(medium) || Number.isNaN(hard)) {
    throw new AllocationValidationError('Difficulty distribution contains invalid or negative numbers');
  }

  const sum = easy + medium + hard;
  if (Math.abs(sum - 100) > 1) { // Allow slight floating drift before normalization
    throw new AllocationValidationError(\`Difficulty distribution must sum to approximately 100, got \${sum}\`);
  }
};
