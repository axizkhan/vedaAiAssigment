import { z } from 'zod';
import { envUrl } from './validators';
import { validateEnv } from './base';

const webSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_API_URL: envUrl,
  NEXT_PUBLIC_WS_URL: z.string().url(),
});

// For web, we only want to validate what's publicly available or explicitly passed
const envToValidate = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
};

// We don't fail fast immediately here if it's just being imported generically, 
// but Next.js will use this.
const parsed = validateEnv(webSchema, envToValidate, 'Web');

export const webEnv = Object.freeze(parsed);
export type WebEnv = z.infer<typeof webSchema>;
