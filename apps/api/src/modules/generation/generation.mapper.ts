import { GenerationTriggerResult, QueueEstimate } from './generation.types';

export const mapTriggerResponse = (jobId: string, estimate: QueueEstimate): GenerationTriggerResult => {
  return {
    jobId,
    queuePosition: estimate.position,
    estimatedWaitMs: estimate.estimatedWaitMs
  };
};
