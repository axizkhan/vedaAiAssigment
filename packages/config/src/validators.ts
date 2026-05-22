import { z } from 'zod';

export const envBoolean = z
  .string()
  .transform((v) => v === 'true' || v === '1');

export const envNumber = z
  .string()
  .transform(Number)
  .pipe(z.number().min(0));

export const envUrl = z.string().url();

export const envNonEmptyString = z.string().min(1);

export const envJwtSecret = z.string().min(32, 'JWT secret must be at least 32 characters for security.');
