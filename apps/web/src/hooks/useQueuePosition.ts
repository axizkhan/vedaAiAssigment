import { useQueueEvents } from './useSocketEvents';

export function useQueuePosition(assignmentId: string) {
  // Subscribe to queue position updates specifically
  useQueueEvents(assignmentId);
}
