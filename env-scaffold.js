const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.cwd();

const createDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const createFile = (filePath, content) => {
  createDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
};

// 1. Root .env.example
createFile(path.join(ROOT_DIR, '.env.example'), `
# App
NODE_ENV=development
PORT=4000
API_URL=http://localhost:4000
WEB_URL=http://localhost:3000

# Auth
JWT_SECRET=minimum-32-char-random-string-here
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=different-32-char-random-string
REFRESH_TOKEN_EXPIRES_IN=7d

# MongoDB
MONGODB_URI=mongodb://localhost:27017/assessment-ai

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# AI Providers
AI_PROVIDER=groq
GROQ_API_KEY=
OPENROUTER_API_KEY=
AI_MODEL=llama-3.3-70b-versatile
AI_MAX_TOKENS=4000
AI_CONTEXT_TOKEN_LIMIT=12000

# Object Storage
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=assessment-ai-uploads
S3_REGION=us-east-1
S3_FORCE_PATH_STYLE=true

# File Upload
MAX_FILE_SIZE_MB=10
MAX_EXTRACTED_TEXT_CHARS=30000

# Frontend Public
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AI_GENERATION_LIMIT_PER_DAY=20

# PDF
PUPPETEER_EXECUTABLE_PATH=
`);

// 2. packages/config
const configDir = path.join(ROOT_DIR, 'packages/config');

createFile(path.join(configDir, 'package.json'), `
{
  "name": "@assessment-ai/config",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "zod": "^3.22.4",
    "dotenv": "^16.4.5"
  },
  "devDependencies": {
    "@assessment-ai/tsconfig": "workspace:*",
    "@types/node": "^20.11.30",
    "typescript": "^5.4.3"
  }
}
`);

createFile(path.join(configDir, 'tsconfig.json'), `
{
  "extends": "@assessment-ai/tsconfig/node.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
`);

createFile(path.join(configDir, 'src/validators.ts'), `
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
`);

createFile(path.join(configDir, 'src/base.ts'), `
import { z } from 'zod';
import dotenv from 'dotenv';
import { envNumber, envBoolean, envNonEmptyString, envUrl } from './validators';

// Load .env automatically
dotenv.config();

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
  return errors.issues.map((i) => \`  - \${i.path.join('.')}: \${i.message}\`).join('\\n');
}

export function validateEnv<T extends z.ZodTypeAny>(schema: T, env: Record<string, string | undefined>, appName: string): z.infer<T> {
  const parsed = schema.safeParse(env);

  if (!parsed.success) {
    console.error(\`❌ Invalid environment variables for \${appName}:\`);
    console.error(formatZodErrors(parsed.error));
    process.exit(1);
  }

  console.log(\`✅ \${appName} environment validated successfully.\`);
  return parsed.data;
}
`);

createFile(path.join(configDir, 'src/api.ts'), `
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
`);

createFile(path.join(configDir, 'src/worker.ts'), `
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
`);

createFile(path.join(configDir, 'src/web.ts'), `
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
`);

createFile(path.join(configDir, 'src/types.ts'), `
export type { ApiEnv } from './api';
export type { WorkerEnv } from './worker';
export type { WebEnv } from './web';
`);

createFile(path.join(configDir, 'src/index.ts'), `
export * from './api';
export * from './worker';
export * from './web';
export * from './types';
`);

createFile(path.join(configDir, 'README.md'), `
# @assessment-ai/config

Centralized, Zod-validated environment configuration for the Assessment AI monorepo.

## Usage

Never use process.env.X directly in apps. Instead:

\`\`\`ts
import { apiEnv } from '@assessment-ai/config';

console.log(apiEnv.PORT);
\`\`\`

The app will fail fast at startup if environment variables are missing or invalid.
`);

// Update package.json files for apps to include @assessment-ai/config
['apps/api', 'apps/worker', 'apps/web'].forEach(app => {
  const pkgPath = path.join(ROOT_DIR, app, 'package.json');
  if (fs.existsSync(pkgPath)) {
    let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    pkg.dependencies = {
      ...pkg.dependencies,
      "@assessment-ai/config": "workspace:*"
    };
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\\n');
  }
});

console.log('Environment configuration package scaffolded successfully');
