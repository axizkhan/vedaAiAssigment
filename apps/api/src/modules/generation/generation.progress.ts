import { generationQueue } from '@assessment-ai/queue';
import { estimateWaitTime } from '@assessment-ai/queue/src/utils/queue-position';
import { QueueEstimate } from './generation.types';

export const getQueueEstimate = async (jobId: string): Promise<QueueEstimate> => {
  try {
    // We assume 15 seconds average job duration for estimations if not dynamically tracked
    const AVG_JOB_DURATION_MS = 15000; 
    
    const estimate = await estimateWaitTime(generationQueue, jobId, AVG_JOB_DURATION_MS);
    
    if (!estimate) {
      return { position: null, estimatedWaitMs: null };
    }
    
    return estimate;
  } catch (error) {
    // Fail silently on position estimations to not break the UI flow
    return { position: null, estimatedWaitMs: null };
  }
};
