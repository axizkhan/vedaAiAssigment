import { InvalidGenerationStateError } from './generation.errors';
import { GenerationStatus } from './generation.types';

export const validateStatusTransition = (current: string, next: GenerationStatus): void => {
  const c = current.toUpperCase();
  const validTransitions: Record<string, GenerationStatus[]> = {
    'DRAFT': ['QUEUED'],
    'QUEUED': ['GENERATING', 'FAILED'], // Can fail natively if DLQ rules trigger before generating
    'GENERATING': ['COMPLETED', 'FAILED'],
    'COMPLETED': ['QUEUED'], // Regeneration support
    'FAILED': ['QUEUED'] // Retry support
  };

  if (!validTransitions[c] || !validTransitions[c].includes(next)) {
    throw new InvalidGenerationStateError(\`Cannot transition assignment from \${c} to \${next}\`);
  }
};
