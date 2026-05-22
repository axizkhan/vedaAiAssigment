import { GENERATION_CONSTANTS } from './generation.constants';
import { QuotaExceededError } from './generation.errors';
import { validateStatusTransition } from './generation.status';
import { enqueueGenerationJob } from './generation.queue';
import { getQueueEstimate } from './generation.progress';
import { emitGenerationQueued } from './generation.websocket';
import { auditGenerationEvent } from './generation.audit';
import { mapTriggerResponse } from './generation.mapper';
import { GenerationTriggerOptions, GenerationTriggerResult } from './generation.types';

// Stubs for Repositories (To be fully wired)
const UserRepo = {
  getDailyGenerationCount: async (userId: string) => 0,
  incrementDailyCount: async (userId: string) => {},
};

const AssignmentRepo = {
  updateStatus: async (assignmentId: string, status: string) => {},
};

export const validateQuota = async (userId: string): Promise<void> => {
  const currentCount = await UserRepo.getDailyGenerationCount(userId);
  if (currentCount >= GENERATION_CONSTANTS.DEFAULT_DAILY_QUOTA) {
    throw new QuotaExceededError(\`You have reached your daily limit of \${GENERATION_CONSTANTS.DEFAULT_DAILY_QUOTA} generations.\`);
  }
};

export const triggerGenerationService = async (
  options: GenerationTriggerOptions,
  traceId: string,
  assignmentCurrentStatus: string
): Promise<GenerationTriggerResult> => {
  const { assignmentId, userId } = options;

  // 1. Re-validate state transition inside the lock
  validateStatusTransition(assignmentCurrentStatus, 'QUEUED');

  try {
    // 2. Enqueue Job
    const job = await enqueueGenerationJob(options, traceId);

    // 3. Update DB state
    await AssignmentRepo.updateStatus(assignmentId, 'QUEUED');

    // 4. Increment Quota
    await UserRepo.incrementDailyCount(userId);

    // 5. Emit UI events
    emitGenerationQueued(assignmentId, traceId);

    // 6. Audit Logging
    auditGenerationEvent('generation_triggered', assignmentId, userId, traceId, { jobId: job.id });

    // 7. Get estimates
    const estimate = await getQueueEstimate(job.id!);

    return mapTriggerResponse(job.id!, estimate);

  } catch (error) {
    // If DB or Queue fails, we do NOT swallow the error.
    // The lock will be released by the controller, and state remains unchanged.
    auditGenerationEvent('generation_trigger_failed', assignmentId, userId, traceId, { error: (error as Error).message });
    throw error;
  }
};
