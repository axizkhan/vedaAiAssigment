import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocketStore } from '../features/websocket/websocket.store';
import { handleReconnect } from '../features/websocket/websocket.reconnect';

export function useRealtimeRecovery() {
  const queryClient = useQueryClient();
  const isConnected = useWebSocketStore((state) => state.isConnected);
  
  useEffect(() => {
    const onVisibilityChange = () => {
      // If browser tab becomes visible again and socket is connected,
      // invalidate globally to protect against stale events that were dropped
      // due to browser suspension or sleep.
      if (document.visibilityState === 'visible' && isConnected) {
        handleReconnect(queryClient);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [isConnected, queryClient]);
}
