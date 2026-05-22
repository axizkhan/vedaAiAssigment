import { GenerationStatus } from './generation.types';
import { InvalidGenerationStateError } from './generation.errors';

export const canRetryGeneration = (currentStatus: string): void => {
  const s = currentStatus?.toUpperCase();
  if (s !== 'FAILED') {
    throw new InvalidGenerationStateError('Only failed assignments can be retried');
  }
};
