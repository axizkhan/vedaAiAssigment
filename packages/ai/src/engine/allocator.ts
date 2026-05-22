import { DifficultyDistribution, AllocationResult } from './allocator.types';
import { normalizeDifficulty } from './difficulty-normalizer';
import { validateAllocationInput } from './allocator.validators';
import { deterministicFloor, getFractionalPart } from './deterministic-rounding';
import { distributeRemainder } from './remainder-distributor';
import { balanceMarks } from './mark-balancer';
import { allocatorMetrics } from './allocator.metrics';
import { AllocationNormalizationError } from './allocator.errors';

export const allocateQuestions = (totalQuestions: number, dist: DifficultyDistribution) => {
  const normalized = normalizeDifficulty(dist);

  const rawEasy = (normalized.easy / 100) * totalQuestions;
  const rawMedium = (normalized.medium / 100) * totalQuestions;
  const rawHard = (normalized.hard / 100) * totalQuestions;

  const baseAllocations = {
    easy: deterministicFloor(rawEasy),
    medium: deterministicFloor(rawMedium),
    hard: deterministicFloor(rawHard)
  };

  const currentSum = baseAllocations.easy + baseAllocations.medium + baseAllocations.hard;
  const remainder = totalQuestions - currentSum;

  const fractions = [
    { key: 'easy' as const, fraction: getFractionalPart(rawEasy) },
    { key: 'medium' as const, fraction: getFractionalPart(rawMedium) },
    { key: 'hard' as const, fraction: getFractionalPart(rawHard) }
  ];

  const distributed = distributeRemainder(baseAllocations, fractions, remainder);

  if (distributed.easy + distributed.medium + distributed.hard !== totalQuestions) {
    throw new AllocationNormalizationError('Deterministic allocation failed to preserve total questions');
  }

  return {
    easy: distributed.easy,
    medium: distributed.medium,
    hard: distributed.hard,
    total: totalQuestions
  };
};

export const normalizeAndAllocate = (
  totalQuestions: number,
  totalMarks: number,
  dist: DifficultyDistribution,
  traceId?: string
): AllocationResult => {
  const startTime = Date.now();

  try {
    validateAllocationInput(totalQuestions, totalMarks, dist);

    const normalizedDistribution = normalizeDifficulty(dist);
    const allocatedQuestions = allocateQuestions(totalQuestions, normalizedDistribution);
    const allocatedMarks = balanceMarks(totalMarks, allocatedQuestions);

    const durationMs = Date.now() - startTime;
    
    allocatorMetrics.trackSuccess({ traceId, totalQuestions, totalMarks, durationMs });

    return {
      questions: allocatedQuestions,
      marks: allocatedMarks,
      normalizedDistribution
    };
  } catch (error: any) {
    allocatorMetrics.trackFailure(error, traceId);
    throw error;
  }
};
