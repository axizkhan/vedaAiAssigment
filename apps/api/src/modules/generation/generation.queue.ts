import { generationQueue } from '@assessment-ai/queue';
import { GenerationTriggerOptions } from './generation.types';

export const enqueueGenerationJob = async (
  options: GenerationTriggerOptions,
  traceId: string
) => {
  const payload = {
    assignmentId: options.assignmentId,
    userId: options.userId,
    promptVersion: options.promptVersion || 'v1',
    traceId,
    requestedAt: new Date().toISOString()
  };

  // Add to BullMQ
  const job = await generationQueue.add('generate-assessment', payload);
  return job;
};
