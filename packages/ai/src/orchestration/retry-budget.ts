import { RetryBudgetExceededError } from './orchestration.errors';

export const validateRetryBudget = (attemptNumber: number, maxAttempts: number): void => {
  if (attemptNumber > maxAttempts) {
    throw new RetryBudgetExceededError(\`Exceeded maximum generation retry budget of \${maxAttempts} attempts\`);
  }
};
