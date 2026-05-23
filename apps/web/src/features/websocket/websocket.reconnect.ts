import { QueryClient } from '@tanstack/react-query';
import { useWebSocketStore } from './websocket.store';
import { reconcileRealtimeState } from './websocket.sync';

export const restoreRoomSubscriptions = () => {
  useWebSocketStore.getState().restoreSubscriptions();
};

export const resyncRealtimeAssignments = async (queryClient: QueryClient) => {
  const { subscribedAssignments } = useWebSocketStore.getState();
  const resyncPromises = Array.from(subscribedAssignments).map(assignmentId =>
    reconcileRealtimeState(assignmentId, queryClient)
  );
  await Promise.allSettled(resyncPromises);
};

export const recoverStaleQueries = async (queryClient: QueryClient) => {
  // Invalidates global queue and status queries that might have become stale
  await queryClient.invalidateQueries({ queryKey: ['queue'] });
  await queryClient.invalidateQueries({ queryKey: ['generation'] });
};

export const handleReconnect = async (queryClient: QueryClient) => {
  restoreRoomSubscriptions();
  await recoverStaleQueries(queryClient);
  await resyncRealtimeAssignments(queryClient);
};
