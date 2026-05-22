import { Model } from 'mongoose';
import { AssignmentEvent } from '../models/assignment-event.model';
import { Assignment } from '../models/assignment.model';
import { GeneratedPaper } from '../models/generated-paper.model';
import { User } from '../models/user.model';
import { SeedLogger } from './seed-logger';
import { SeedContext, SeedResult } from './seed-types';
import { measureExecutionTime } from './seed-utils';

const INDEXED_MODELS: Array<{ name: string; model: Model<unknown> }> = [
  { name: 'User', model: User as unknown as Model<unknown> },
  { name: 'Assignment', model: Assignment as unknown as Model<unknown> },
  { name: 'GeneratedPaper', model: GeneratedPaper as unknown as Model<unknown> },
  { name: 'AssignmentEvent', model: AssignmentEvent as unknown as Model<unknown> },
];

export async function seedIndexes(context: SeedContext, seedLogger: SeedLogger): Promise<SeedResult> {
  const { result, durationMs } = await measureExecutionTime(async () => {
    let syncedCount = 0;
    const modelResults: Array<{ model: string; operation: string; changedIndexes: number }> = [];

    for (const { name, model } of INDEXED_MODELS) {
      if (context.environment === 'production') {
        await model.createIndexes();
        syncedCount += 1;
        modelResults.push({ model: name, operation: 'createIndexes', changedIndexes: 0 });
        seedLogger.info('Indexes ensured without destructive sync.', { model: name });
        continue;
      }

      const droppedIndexes = await model.syncIndexes();
      const changedIndexes = Array.isArray(droppedIndexes) ? droppedIndexes.length : Object.keys(droppedIndexes ?? {}).length;
      syncedCount += 1;
      modelResults.push({ model: name, operation: 'syncIndexes', changedIndexes });
      seedLogger.info('Indexes synchronized.', { model: name, changedIndexes });
    }

    return { syncedCount, modelResults };
  });

  return {
    name: 'seed-indexes',
    status: 'success',
    durationMs,
    metadata: {
      indexesSynced: result.syncedCount,
      models: result.modelResults,
      destructiveSync: context.environment !== 'production',
    },
  };
}
