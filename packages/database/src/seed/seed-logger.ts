import { logger } from '@assessment-ai/logger';
import { SeedContext } from './seed-types';

const SECRET_KEYS = ['password', 'passwordHash', 'token', 'secret', 'uri', 'connectionString', 'apiKey'];

function sanitizeMetadata(metadata: Record<string, unknown> = {}): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(metadata)) {
    sanitized[key] = SECRET_KEYS.some((secretKey) => key.toLowerCase().includes(secretKey)) ? '[REDACTED]' : value;
  }
  return sanitized;
}

export class SeedLogger {
  constructor(private readonly context: Pick<SeedContext, 'traceId' | 'environment' | 'verbose'>) {}

  info(message: string, metadata: Record<string, unknown> = {}): void {
    if (!this.context.verbose && this.context.environment === 'test') return;
    logger.info({ traceId: this.context.traceId, environment: this.context.environment, ...sanitizeMetadata(metadata) }, message);
  }

  warn(message: string, metadata: Record<string, unknown> = {}): void {
    logger.warn({ traceId: this.context.traceId, environment: this.context.environment, ...sanitizeMetadata(metadata) }, message);
  }

  error(message: string, metadata: Record<string, unknown> = {}): void {
    logger.error({ traceId: this.context.traceId, environment: this.context.environment, ...sanitizeMetadata(metadata) }, message);
  }

  console(message: string): void {
    if (this.context.environment !== 'test') process.stdout.write(`${message}\n`);
  }
}
