import { ContextBudgetExceededError } from './context.errors';

export const validateBudgetSafeguards = (
  estimatedTokens: number,
  availableTokens: number
): boolean => {
  if (availableTokens <= 0) {
    throw new ContextBudgetExceededError('Zero or negative tokens available for context after reservations');
  }

  return estimatedTokens <= availableTokens;
};
