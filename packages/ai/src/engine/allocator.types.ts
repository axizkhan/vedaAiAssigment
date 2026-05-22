export interface DifficultyDistribution {
  easy: number;
  medium: number;
  hard: number;
}

export interface AllocatedQuestions {
  easy: number;
  medium: number;
  hard: number;
  total: number;
}

export interface AllocatedMarks {
  easy: number;
  medium: number;
  hard: number;
  total: number;
}

export interface AllocationResult {
  questions: AllocatedQuestions;
  marks: AllocatedMarks;
  normalizedDistribution: DifficultyDistribution;
}

export interface AllocationMetrics {
  durationMs: number;
  roundingAdjustments: number;
  remainderDistributionCount: number;
}
