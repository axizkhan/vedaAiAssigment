import { Queue } from 'bullmq';
import { QueueWaitEstimation } from '../queue.types';

export const getQueuePosition = async (queue: Queue, jobId: string): Promise<number | null> => {
  const state = await queue.getJobState(jobId);
  if (state === 'active' || state === 'completed' || state === 'failed') {
    return 0;
  }

  // BullMQ doesn't have a direct O(1) "get rank in waiting" without fetching the list.
  // For production, we get the waiting jobs and find index.
  // Warning: If queue is massive (>10k), this requires a Lua script or pagination.
  const waitingJobs = await queue.getWaiting();
  const index = waitingJobs.findIndex(job => job.id === jobId);
  
  if (index === -1) return null;
  
  return index + 1; // 1-indexed for UI (e.g. "You are 4th in line")
};

export const estimateWaitTime = async (
  queue: Queue, 
  jobId: string, 
  avgJobDurationMs: number
): Promise<QueueWaitEstimation | null> => {
  const position = await getQueuePosition(queue, jobId);
  if (position === null) return null;

  const activeCount = await queue.getActiveCount();
  
  // Very rough heuristic:
  // If there are 2 active workers, and you are position 4, you have to wait for roughly 2 cycles.
  // We don't perfectly know concurrency here, so we assume 1 worker as a conservative estimate.
  const estimatedWaitMs = (activeCount + position) * avgJobDurationMs;

  return {
    position,
    estimatedWaitMs
  };
};
