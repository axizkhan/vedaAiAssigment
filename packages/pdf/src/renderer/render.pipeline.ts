import { RenderTimeoutError } from './render.errors';

export const withRenderTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number = 90000
): Promise<T> => {
  let timeoutHandle: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new RenderTimeoutError(\`Render timed out after \${timeoutMs}ms\`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutHandle);
  });
};
