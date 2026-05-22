import { DifficultyDistribution } from './allocator.types';
import { DifficultyDistributionError } from './allocator.errors';
import { safeDivide } from './allocator.utils';

export const normalizeDifficulty = (dist: DifficultyDistribution): DifficultyDistribution => {
  const sum = dist.easy + dist.medium + dist.hard;
  
  if (sum === 0) {
    throw new DifficultyDistributionError('Difficulty distribution cannot sum to 0');
  }

  // Exact 100 hit
  if (Math.abs(sum - 100) < Number.EPSILON) {
    return { ...dist };
  }

  // Normalize by scaling up/down to exactly 100%
  const scale = safeDivide(100, sum);
  
  return {
    easy: dist.easy * scale,
    medium: dist.medium * scale,
    hard: dist.hard * scale
  };
};
