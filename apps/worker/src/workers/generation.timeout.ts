import { GenerationTimeoutError } from './generation.errors';

export const withGenerationTimeout = async <T>(
  operation: () => Promise<T>,
  timeoutMs: number = 90000 // 90 seconds default
): Promise<T> => {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new GenerationTimeoutError(\`Generation worker operation timed out after \${timeoutMs}ms\`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([operation(), timeoutPromise]);
  } finally {
    clearTimeout(timeoutId!);
  }
};
