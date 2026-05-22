import { estimateTokens } from './token-estimator';

export const calculateExtractionBudget = (chars: number): number => {
  // Quick heuristic
  return Math.ceil(chars / 4);
};

// Re-export token estimation for convenience
export { estimateTokens };
