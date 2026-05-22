import { AIProviderTimeoutError } from './provider.errors';
import { PROVIDER_CONSTANTS } from './provider.constants';

export const withProviderTimeout = <T>(
  providerName: string,
  operation: (signal: AbortSignal) => Promise<T>,
  timeoutMs: number = PROVIDER_CONSTANTS.DEFAULT_TIMEOUT_MS
): Promise<T> => {
  const controller = new AbortController();
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      controller.abort();
      reject(new AIProviderTimeoutError(providerName, timeoutMs));
    }, timeoutMs);
  });

  return Promise.race([operation(controller.signal), timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
};
