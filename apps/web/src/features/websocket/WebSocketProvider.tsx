'use client';

import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/auth.store';
import { useWebSocketStore } from './websocket.store';
import { connectSocket, cleanupListeners } from './websocket.service';
import { registerSocketEvents } from './websocket.events';
import { handleReconnect } from './websocket.reconnect';

export function WebSocketProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();
  const { setConnected, setReconnecting, reset } = useWebSocketStore();
  
  // We keep a local ref to ensure we can cleanup cleanly
  const socketRef = useRef<ReturnType<typeof connectSocket> | null>(null);

  useEffect(() => {
    if (!accessToken) {
      if (socketRef.current) {
        cleanupListeners(socketRef.current);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      reset();
      return;
    }

    // Connect socket
    socketRef.current = connectSocket(accessToken);
    const socket = socketRef.current;

    // Authenticate and set up connection handling
    socket.on('connect', () => {
      setConnected(socket);
    });

    socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        // Disconnected explicitly by server
        socket.connect();
      }
    });

    socket.io.on('reconnect_attempt', (attemptNumber) => {
      setReconnecting(attemptNumber);
    });

    socket.io.on('reconnect', () => {
      setConnected(socket);
      handleReconnect(queryClient);
    });

    socket.on('connect_error', (error) => {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[WS] Connection error:', error);
      }
    });

    // Register all feature listeners
    registerSocketEvents(socket, queryClient);

    return () => {
      cleanupListeners(socket);
      socket.disconnect();
      socketRef.current = null;
      reset();
    };
  }, [accessToken, queryClient, setConnected, setReconnecting, reset]);

  return <>{children}</>;
}
