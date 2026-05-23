import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { reconcileRealtimeState } from '../features/websocket/websocket.sync';
import { WEBSOCKET_CONSTANTS } from '../features/websocket/websocket.constants';

export function useGenerationSync(assignmentId: string, status: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (status !== 'generating' && status !== 'queued') {
      return;
    }

    const interval = setInterval(() => {
      reconcileRealtimeState(assignmentId, queryClient);
    }, WEBSOCKET_CONSTANTS.POLLING_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [assignmentId, status, queryClient]);
}
