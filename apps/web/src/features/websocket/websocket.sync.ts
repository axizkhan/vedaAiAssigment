import { QueryClient } from '@tanstack/react-query';

export const syncAssignmentState = async (assignmentId: string, queryClient: QueryClient) => {
  await queryClient.invalidateQueries({ queryKey: ['assignment', assignmentId] });
};

export const syncPaperVersion = async (assignmentId: string, queryClient: QueryClient) => {
  await queryClient.invalidateQueries({ queryKey: ['paper', assignmentId] });
};

export const recoverMissedProgress = async (assignmentId: string, queryClient: QueryClient) => {
  await queryClient.invalidateQueries({ queryKey: ['generation', assignmentId] });
};

export const reconcileRealtimeState = async (assignmentId: string, queryClient: QueryClient) => {
  await Promise.all([
    syncAssignmentState(assignmentId, queryClient),
    syncPaperVersion(assignmentId, queryClient),
    recoverMissedProgress(assignmentId, queryClient),
  ]);
};
