import { ZodError } from 'zod';

export function formatZodDetails(error: ZodError): Record<string, string[]> {
  return error.issues.reduce<Record<string, string[]>>((details, issue) => {
    const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
    details[path] = [...(details[path] ?? []), issue.message];
    return details;
  }, {});
}

export function getErrorName(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'name' in error) {
    return String((error as { name?: unknown }).name);
  }
  return undefined;
}

export function getErrorCode(error: unknown): string | number | undefined {
  if (error && typeof error === 'object' && 'code' in error) {
    return (error as { code?: string | number }).code;
  }
  return undefined;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return '';
}
