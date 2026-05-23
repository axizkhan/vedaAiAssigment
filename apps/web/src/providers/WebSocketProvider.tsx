import React, { useEffect } from 'react';
import { useWebSocketStore } from '../store/websocket.store';

// Stub for Auth Hook
const useAuth = () => ({ token: 'mock-jwt-token' });

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const connect = useWebSocketStore((state) => state.connect);
  const disconnect = useWebSocketStore((state) => state.disconnect);

  useEffect(() => {
    if (token) {
      connect(token);
    }
    return () => {
      disconnect();
    };
  }, [token, connect, disconnect]);

  return <>{children}</>;
};
