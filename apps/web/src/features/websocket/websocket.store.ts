import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@assessment-ai/types/src/socket.types';
import { WebsocketMetrics } from './websocket.metrics';

interface WebSocketState {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isConnected: boolean;
  reconnecting: boolean;
  reconnectAttempts: number;
  subscribedAssignments: Set<string>;
  lastEventAt: number | null;
  lastSyncAt: number | null;
  
  setConnected: (socket: Socket<ServerToClientEvents, ClientToServerEvents>) => void;
  setReconnecting: (attempts: number) => void;
  subscribe: (assignmentId: string) => void;
  unsubscribe: (assignmentId: string) => void;
  restoreSubscriptions: () => void;
  setLastEvent: () => void;
  reset: () => void;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  reconnecting: false,
  reconnectAttempts: 0,
  subscribedAssignments: new Set(),
  lastEventAt: null,
  lastSyncAt: null,

  setConnected: (socket) => {
    set({
      socket,
      isConnected: true,
      reconnecting: false,
      reconnectAttempts: 0,
    });
    WebsocketMetrics.trackConnection('connected');
  },

  setReconnecting: (attempts) => {
    set({
      isConnected: false,
      reconnecting: true,
      reconnectAttempts: attempts,
    });
    WebsocketMetrics.trackReconnectAttempt(attempts);
  },

  subscribe: (assignmentId) => {
    const { socket, subscribedAssignments } = get();
    const newSubs = new Set(subscribedAssignments);
    newSubs.add(assignmentId);
    set({ subscribedAssignments: newSubs });

    if (socket?.connected) {
      socket.emit('assignment:join', { assignmentId });
    }
  },

  unsubscribe: (assignmentId) => {
    const { socket, subscribedAssignments } = get();
    const newSubs = new Set(subscribedAssignments);
    newSubs.delete(assignmentId);
    set({ subscribedAssignments: newSubs });

    if (socket?.connected) {
      socket.emit('assignment:leave', { assignmentId });
    }
  },

  restoreSubscriptions: () => {
    const { socket, subscribedAssignments } = get();
    if (socket?.connected && subscribedAssignments.size > 0) {
      subscribedAssignments.forEach((assignmentId) => {
        socket.emit('assignment:join', { assignmentId });
        WebsocketMetrics.trackSubscriptionRestore(assignmentId);
      });
    }
  },

  setLastEvent: () => {
    set({ lastEventAt: Date.now() });
  },

  reset: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
    set({
      socket: null,
      isConnected: false,
      reconnecting: false,
      reconnectAttempts: 0,
      subscribedAssignments: new Set(),
      lastEventAt: null,
      lastSyncAt: null,
    });
    WebsocketMetrics.trackConnection('disconnected', { reason: 'store_reset' });
  }
}));
