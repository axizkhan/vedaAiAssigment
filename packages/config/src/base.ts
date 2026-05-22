import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { envNumber, envBoolean, envNonEmptyString, envUrl } from './validators';

let currentDir = process.cwd();
while (currentDir !== '/' && currentDir !== path.parse(currentDir).root) {
  const envPath = path.join(currentDir, '.env');
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
  currentDir = path.dirname(currentDir);
}

export const baseEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Redis
  REDIS_HOST: envNonEmptyString.default('localhost'),
  REDIS_PORT: envNumber.default('6379'),
  REDIS_PASSWORD: z.string().optional(),

  // MongoDB
  MONGODB_URI: envNonEmptyString,

  // S3
  S3_ENDPOINT: envUrl,
  S3_ACCESS_KEY: envNonEmptyString,
  S3_SECRET_KEY: envNonEmptyString,
  S3_BUCKET: envNonEmptyString,
  S3_REGION: envNonEmptyString.default('us-east-1'),
  S3_FORCE_PATH_STYLE: envBoolean.default('true'),

  // AI Providers
  AI_PROVIDER: z.enum(['groq', 'openrouter']),
  GROQ_API_KEY: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional(),
  AI_MODEL: envNonEmptyString,
  AI_MAX_TOKENS: envNumber,
  AI_CONTEXT_TOKEN_LIMIT: envNumber,

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: envNumber,
  RATE_LIMIT_MAX_REQUESTS: envNumber,
  AI_GENERATION_LIMIT_PER_DAY: envNumber,
});

export function formatZodErrors(errors: z.ZodError) {
  return errors.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
}

export function validateEnv<T extends z.ZodTypeAny>(schema: T, env: Record<string, string | undefined>, appName: string): z.infer<T> {
  const parsed = schema.safeParse(env);

  if (!parsed.success) {
    console.error(`❌ Invalid environment variables for ${appName}:`);
    console.error(formatZodErrors(parsed.error));
    process.exit(1);
  }

  console.log(`✅ ${appName} environment validated successfully.`);
  return parsed.data;
}
