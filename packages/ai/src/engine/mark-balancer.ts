import { AllocatedQuestions, AllocatedMarks } from './allocator.types';
import { getBaseWeights } from './weighted-distribution';
import { distributeRemainder } from './remainder-distributor';
import { deterministicFloor, getFractionalPart } from './deterministic-rounding';
import { MarkDistributionError } from './allocator.errors';
import { safeDivide } from './allocator.utils';

export const balanceMarks = (totalMarks: number, allocatedQuestions: AllocatedQuestions): AllocatedMarks => {
  if (totalMarks < allocatedQuestions.total) {
    throw new MarkDistributionError(\`Cannot distribute \${totalMarks} marks across \${allocatedQuestions.total} questions without fractional marks\`);
  }

  const weights = getBaseWeights();

  // If there's only 1 type of question, give all marks to it
  if (allocatedQuestions.easy === allocatedQuestions.total) return { easy: totalMarks, medium: 0, hard: 0, total: totalMarks };
  if (allocatedQuestions.medium === allocatedQuestions.total) return { easy: 0, medium: totalMarks, hard: 0, total: totalMarks };
  if (allocatedQuestions.hard === allocatedQuestions.total) return { easy: 0, medium: 0, hard: totalMarks, total: totalMarks };

  // 1. Calculate raw target pools based on ideal weights, accounting for 0 questions
  const easyWeight = allocatedQuestions.easy > 0 ? weights.EASY : 0;
  const mediumWeight = allocatedQuestions.medium > 0 ? weights.MEDIUM : 0;
  const hardWeight = allocatedQuestions.hard > 0 ? weights.HARD : 0;
  const totalWeight = easyWeight + mediumWeight + hardWeight;

  const easyPoolTarget = safeDivide(easyWeight, totalWeight) * totalMarks;
  const mediumPoolTarget = safeDivide(mediumWeight, totalWeight) * totalMarks;
  const hardPoolTarget = safeDivide(hardWeight, totalWeight) * totalMarks;

  // 2. Base allocation: each question must get at least 1 mark (if totalMarks >= totalQuestions)
  let easyTotal = allocatedQuestions.easy;
  let mediumTotal = allocatedQuestions.medium;
  let hardTotal = allocatedQuestions.hard;

  // 3. Find how many marks are left to distribute
  let remainingMarks = totalMarks - (easyTotal + mediumTotal + hardTotal);

  // 4. Distribute proportionally to pools
  if (remainingMarks > 0) {
    // How many extra marks each pool "wants"
    const easyExtraTarget = Math.max(0, easyPoolTarget - easyTotal);
    const mediumExtraTarget = Math.max(0, mediumPoolTarget - mediumTotal);
    const hardExtraTarget = Math.max(0, hardPoolTarget - hardTotal);
    const extraTotalTarget = easyExtraTarget + mediumExtraTarget + hardExtraTarget;

    const easyExtra = extraTotalTarget > 0 ? (easyExtraTarget / extraTotalTarget) * remainingMarks : 0;
    const mediumExtra = extraTotalTarget > 0 ? (mediumExtraTarget / extraTotalTarget) * remainingMarks : 0;
    const hardExtra = extraTotalTarget > 0 ? (hardExtraTarget / extraTotalTarget) * remainingMarks : 0;

    const baseExtras = {
      easy: deterministicFloor(easyExtra),
      medium: deterministicFloor(mediumExtra),
      hard: deterministicFloor(hardExtra)
    };

    const fractions = [
      { key: 'easy' as const, fraction: getFractionalPart(easyExtra) },
      { key: 'medium' as const, fraction: getFractionalPart(mediumExtra) },
      { key: 'hard' as const, fraction: getFractionalPart(hardExtra) }
    ].filter(f => allocatedQuestions[f.key] > 0);

    const fractionalRemainder = remainingMarks - (baseExtras.easy + baseExtras.medium + baseExtras.hard);
    const distributedExtras = distributeRemainder(baseExtras, fractions, fractionalRemainder);

    easyTotal += distributedExtras.easy;
    mediumTotal += distributedExtras.medium;
    hardTotal += distributedExtras.hard;
  }

  return {
    easy: easyTotal,
    medium: mediumTotal,
    hard: hardTotal,
    total: easyTotal + mediumTotal + hardTotal
  };
};
