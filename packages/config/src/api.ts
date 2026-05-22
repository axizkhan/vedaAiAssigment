import { z } from 'zod';
import { baseEnvSchema, validateEnv } from './base';
import { envJwtSecret, envNumber, envUrl } from './validators';

const apiSchema = baseEnvSchema.extend({
  PORT: envNumber.default('4000'),
  API_URL: envUrl,
  WEB_URL: envUrl,

  // Auth
  JWT_SECRET: envJwtSecret,
  JWT_EXPIRES_IN: z.string().min(1),
  REFRESH_TOKEN_SECRET: envJwtSecret,
  REFRESH_TOKEN_EXPIRES_IN: z.string().min(1),

  // File Upload
  MAX_FILE_SIZE_MB: envNumber,
  MAX_EXTRACTED_TEXT_CHARS: envNumber,
}).superRefine((data, ctx) => {
  if (data.NODE_ENV === 'production' && data.JWT_SECRET === 'minimum-32-char-random-string-here') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Cannot use default JWT secret in production.',
      path: ['JWT_SECRET'],
    });
  }
  
  if (data.AI_PROVIDER === 'groq' && !data.GROQ_API_KEY) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'GROQ_API_KEY is required when AI_PROVIDER is groq',
      path: ['GROQ_API_KEY'],
    });
  }
});

const parsed = validateEnv(apiSchema, process.env, 'API');

export const apiEnv = Object.freeze(parsed);
export type ApiEnv = z.infer<typeof apiSchema>;
