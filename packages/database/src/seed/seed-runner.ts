import { connectDatabase, disconnectDatabase } from '../connection';
import { SeedLogger } from './seed-logger';
import { seedDefaultAdmin } from './seed-admin';
import { seedIndexes } from './seed-indexes';
import { SeedContext, SeedDatabaseConnectionError, SeedExecutionSummary, SeedResult } from './seed-types';
import { classifySeedError, createSeedTraceId, formatSeedSummary, measureExecutionTime, validateSeedEnvironment } from './seed-utils';

async function runStep(name: string, results: SeedResult[], step: () => Promise<SeedResult>, seedLogger: SeedLogger): Promise<SeedResult> {
  try {
    const result = await step();
    results.push(result);
    return result;
  } catch (error) {
    const failedResult: SeedResult = {
      name,
      status: 'failed',
      durationMs: 0,
      error: error instanceof Error ? error.message : String(error),
      metadata: { errorType: classifySeedError(error) },
    };
    results.push(failedResult);
    seedLogger.error('Seed step failed.', { step: name, errorType: classifySeedError(error), error: failedResult.error });
    throw error;
  }
}

export async function runDatabaseSeed(env: NodeJS.ProcessEnv = process.env, traceId = createSeedTraceId()): Promise<SeedExecutionSummary> {
  const context: SeedContext = validateSeedEnvironment(env, traceId);
  const seedLogger = new SeedLogger(context);
  const results: SeedResult[] = [];
  let connected = false;

  seedLogger.console('Starting database seed...');
  seedLogger.info('Starting database seed execution.');

  const { result: summary, durationMs } = await measureExecutionTime(async () => {
    try {
      await connectDatabase(context.mongoUri);
      connected = true;
      seedLogger.console('Database connected');
      seedLogger.info('Database connected for seed execution.');
    } catch (error) {
      seedLogger.error('Database connection failed.', { errorType: classifySeedError(error), error: error instanceof Error ? error.message : String(error) });
      throw new SeedDatabaseConnectionError(error instanceof Error ? error.message : String(error));
    }

    const indexResult = await runStep('seed-indexes', results, () => seedIndexes(context, seedLogger), seedLogger);
    seedLogger.console('Indexes synced');

    const adminResult = await runStep('seed-admin', results, () => seedDefaultAdmin(context, seedLogger), seedLogger);
    seedLogger.console(adminResult.status === 'skipped' ? 'Default admin already exists' : 'Default admin created');

    return {
      traceId: context.traceId,
      environment: context.environment,
      status: 'success' as const,
      indexesSynced: Number(indexResult.metadata?.indexesSynced ?? 0),
      adminCreated: Boolean(adminResult.metadata?.adminCreated),
      durationMs: 0,
      results,
    };
  });

  summary.durationMs = durationMs;

  if (connected) {
    await disconnectDatabase();
    seedLogger.info('Database disconnected after seed execution.');
  }

  seedLogger.console('Seed completed successfully');
  seedLogger.console(formatSeedSummary(summary));
  seedLogger.info('Database seed execution completed.', {
    durationMs,
    indexesSynced: summary.indexesSynced,
    adminCreated: summary.adminCreated,
  });

  return summary;
}

export async function disconnectSeedDatabaseSafely(seedLogger?: SeedLogger): Promise<void> {
  try {
    await disconnectDatabase();
  } catch (error) {
    seedLogger?.error('Failed to disconnect seed database gracefully.', { error: error instanceof Error ? error.message : String(error) });
  }
}
