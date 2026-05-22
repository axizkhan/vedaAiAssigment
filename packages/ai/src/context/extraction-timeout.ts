import { ExtractionTimeoutError } from './extractor.errors';

export const withTimeout = <T>(
  operation: Promise<T>,
  timeoutMs: number,
  abortController?: AbortController
): Promise<T> => {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      if (abortController) {
        abortController.abort();
      }
      reject(new ExtractionTimeoutError(timeoutMs));
    }, timeoutMs);
  });

  return Promise.race([operation, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
};
