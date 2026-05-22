import { z } from 'zod';
import { baseEnvSchema, validateEnv } from './base';

const workerSchema = baseEnvSchema.extend({
  PUPPETEER_EXECUTABLE_PATH: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.AI_PROVIDER === 'groq' && !data.GROQ_API_KEY) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'GROQ_API_KEY is required when AI_PROVIDER is groq',
      path: ['GROQ_API_KEY'],
    });
  }
});

const parsed = validateEnv(workerSchema, process.env, 'Worker');

export const workerEnv = Object.freeze(parsed);
export type WorkerEnv = z.infer<typeof workerSchema>;
