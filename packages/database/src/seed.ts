import '@assessment-ai/config/base';
import { SeedLogger } from './seed/seed-logger';
import { disconnectSeedDatabaseSafely, runDatabaseSeed } from './seed/seed-runner';
import { createSeedTraceId, validateSeedEnvironment, classifySeedError } from './seed/seed-utils';

const traceId = createSeedTraceId();
let shuttingDown = false;

function buildFallbackLogger(): SeedLogger {
  try {
    const context = validateSeedEnvironment(process.env, traceId);
    return new SeedLogger(context);
  } catch {
    return new SeedLogger({ traceId, environment: 'development', verbose: true });
  }
}

async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  const seedLogger = buildFallbackLogger();
  seedLogger.warn('Seed process received shutdown signal.', { signal });
  await disconnectSeedDatabaseSafely(seedLogger);
  process.exit(signal === 'completed' ? 0 : 1);
}

process.once('SIGINT', () => void shutdown('SIGINT'));
process.once('SIGTERM', () => void shutdown('SIGTERM'));

process.once('uncaughtException', (error) => {
  const seedLogger = buildFallbackLogger();
  seedLogger.error('Uncaught exception during seed execution.', {
    errorType: classifySeedError(error),
    error: error.message,
  });
  void disconnectSeedDatabaseSafely(seedLogger).finally(() => process.exit(1));
});

process.once('unhandledRejection', (reason) => {
  const seedLogger = buildFallbackLogger();
  seedLogger.error('Unhandled rejection during seed execution.', {
    errorType: classifySeedError(reason),
    error: reason instanceof Error ? reason.message : String(reason),
  });
  void disconnectSeedDatabaseSafely(seedLogger).finally(() => process.exit(1));
});

runDatabaseSeed(process.env, traceId)
  .then(() => shutdown('completed'))
  .catch(async (error) => {
    const seedLogger = buildFallbackLogger();
    seedLogger.error('Database seed execution failed.', {
      errorType: classifySeedError(error),
      error: error instanceof Error ? error.message : String(error),
    });
    await disconnectSeedDatabaseSafely(seedLogger);
    process.exit(1);
  });
