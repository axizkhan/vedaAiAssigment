export interface RemainderCandidate {
  key: 'easy' | 'medium' | 'hard';
  fraction: number;
}

export const distributeRemainder = (
  baseAllocations: { easy: number; medium: number; hard: number },
  fractions: RemainderCandidate[],
  remainderAmount: number
): { easy: number; medium: number; hard: number } => {
  // Sort candidates by fractional part descending.
  // If fractions are identical, sort by difficulty tier (Hard -> Medium -> Easy) to stabilize.
  const sorted = [...fractions].sort((a, b) => {
    if (Math.abs(b.fraction - a.fraction) > Number.EPSILON) {
      return b.fraction - a.fraction;
    }
    const priority = { hard: 3, medium: 2, easy: 1 };
    return priority[b.key] - priority[a.key];
  });

  const result = { ...baseAllocations };
  
  // Distribute the exact integer remainder
  for (let i = 0; i < remainderAmount; i++) {
    const candidate = sorted[i % sorted.length];
    result[candidate.key] += 1;
  }

  return result;
};
