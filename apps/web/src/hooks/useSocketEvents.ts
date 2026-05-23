import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocketStore } from '../features/websocket/websocket.store';

export function useSocketEvents(assignmentId: string) {
  const { subscribe, unsubscribe } = useWebSocketStore();

  useEffect(() => {
    if (!assignmentId) return;
    
    subscribe(assignmentId);
    
    return () => {
      unsubscribe(assignmentId);
    };
  }, [assignmentId, subscribe, unsubscribe]);
}

export function useGenerationEvents(assignmentId: string) {
  useSocketEvents(assignmentId);
}

export function useQueueEvents(assignmentId: string) {
  useSocketEvents(assignmentId);
}

export function usePdfEvents(assignmentId: string) {
  useSocketEvents(assignmentId);
}
