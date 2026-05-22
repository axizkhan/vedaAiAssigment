import { z } from 'zod';
import { SeedConfigurationError, SeedContext, SeedEnvironment, SeedExecutionSummary, SeedValidationError } from './seed-types';

const PLACEHOLDER_VALUES = new Set([
  'admin@example.com',
  'test@example.com',
  'password',
  'password123',
  'changeme',
  'change-me',
  'minimum-32-char-random-string-here',
]);

const seedEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  MONGODB_URI: z.string().trim().min(1, 'MONGODB_URI is required.'),
  ADMIN_EMAIL: z.string().trim().email('ADMIN_EMAIL must be a valid email address.'),
  ADMIN_PASSWORD: z.string().min(8, 'ADMIN_PASSWORD must be at least 8 characters.'),
  ADMIN_NAME: z.string().trim().min(2, 'ADMIN_NAME must be at least 2 characters.').max(100),
});

export function createSeedTraceId(): string {
  return `seed_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function measureExecutionTime<T>(fn: () => Promise<T>): Promise<{ result: T; durationMs: number }> {
  const start = Date.now();
  const result = await fn();
  return { result, durationMs: Date.now() - start };
}

export function validateSeedEnvironment(env: NodeJS.ProcessEnv = process.env, traceId = createSeedTraceId()): SeedContext {
  const parsed = seedEnvSchema.safeParse(env);
  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
    throw new SeedConfigurationError(message);
  }

  const data = parsed.data;
  const normalizedPassword = data.ADMIN_PASSWORD.toLowerCase();

  if (data.NODE_ENV === 'production') {
    if (data.ADMIN_PASSWORD.length < 12) {
      throw new SeedValidationError('ADMIN_PASSWORD must be at least 12 characters in production.');
    }

    if (!/[A-Z]/.test(data.ADMIN_PASSWORD) || !/[a-z]/.test(data.ADMIN_PASSWORD) || !/[0-9]/.test(data.ADMIN_PASSWORD) || !/[^A-Za-z0-9]/.test(data.ADMIN_PASSWORD)) {
      throw new SeedValidationError('ADMIN_PASSWORD must include uppercase, lowercase, number, and symbol characters in production.');
    }

    if (PLACEHOLDER_VALUES.has(data.ADMIN_EMAIL.toLowerCase()) || PLACEHOLDER_VALUES.has(normalizedPassword)) {
      throw new SeedValidationError('Placeholder admin credentials are not allowed in production.');
    }
  }

  return {
    environment: data.NODE_ENV as SeedEnvironment,
    mongoUri: data.MONGODB_URI,
    adminEmail: data.ADMIN_EMAIL.toLowerCase(),
    adminPassword: data.ADMIN_PASSWORD,
    adminName: data.ADMIN_NAME,
    traceId,
    startedAt: new Date(),
    verbose: data.NODE_ENV !== 'test',
  };
}

export function classifySeedError(error: unknown): string {
  if (error instanceof SeedValidationError) return 'validation_error';
  if (error instanceof SeedConfigurationError) return 'configuration_error';
  if (error instanceof Error && error.name === 'MongoServerError') return 'database_error';
  if (error instanceof Error && error.message.toLowerCase().includes('duplicate')) return 'duplicate_key_error';
  if (error instanceof Error && error.message.toLowerCase().includes('connect')) return 'db_connection_failure';
  return 'unknown_failure';
}

export function formatSeedSummary(summary: SeedExecutionSummary): string {
  const adminCreated = summary.adminCreated ? 'YES' : 'NO';
  const status = summary.status.toUpperCase();

  return [
    '================================',
    'Seed Execution Summary',
    '================================',
    `Trace ID: ${summary.traceId}`,
    `Indexes Synced: ${summary.indexesSynced}`,
    `Admin Created: ${adminCreated}`,
    `Execution Time: ${summary.durationMs}ms`,
    `Environment: ${summary.environment}`,
    `Status: ${status}`,
    '================================',
  ].join('\n');
}
