import { useGenerationEvents } from './useSocketEvents';
import { useGenerationSync } from './useGenerationSync';

export function useRealtimeAssignment(assignmentId: string, currentStatus: string) {
  // Bind socket listeners for generation progress/completion/failure
  useGenerationEvents(assignmentId);

  // Bind hybrid polling fallback in case socket fails
  useGenerationSync(assignmentId, currentStatus);
}
