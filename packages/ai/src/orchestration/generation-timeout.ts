import { GenerationTimeoutError } from './orchestration.errors';
import { createAbortSignal } from './orchestration.utils';

export const executeWithGenerationTimeout = async <T>(
  operation: (signal: AbortSignal) => Promise<T>,
  timeoutMs: number
): Promise<T> => {
  const { signal, cleanup } = createAbortSignal(timeoutMs);

  try {
    const result = await Promise.race([
      operation(signal),
      new Promise<T>((_, reject) => {
        signal.addEventListener('abort', () => {
          reject(new GenerationTimeoutError(\`Generation lifecycle exceeded hard timeout of \${timeoutMs}ms\`));
        });
      })
    ]);
    return result;
  } finally {
    cleanup();
  }
};
