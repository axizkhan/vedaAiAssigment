import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@assessment-ai/types/src/socket.types';
import { createSocketConnection } from '../services/socket.service';

interface WebSocketState {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isConnected: boolean;
  reconnecting: boolean;
  subscribedAssignments: Set<string>;
  lastEventAt: number | null;
  
  connect: (token: string) => void;
  disconnect: () => void;
  subscribeToAssignment: (assignmentId: string) => void;
  unsubscribeFromAssignment: (assignmentId: string) => void;
  restoreSubscriptions: () => void;
  updateLastEventTime: () => void;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  reconnecting: false,
  subscribedAssignments: new Set(),
  lastEventAt: null,

  connect: (token: string) => {
    const { socket } = get();
    if (socket?.connected) return;

    const newSocket = createSocketConnection(token);

    newSocket.on('connect', () => {
      set({ isConnected: true, reconnecting: false });
      get().restoreSubscriptions();
    });

    newSocket.on('disconnect', (reason) => {
      set({ isConnected: false });
      if (reason === 'io server disconnect') {
        // Disconnected by server, won't auto-reconnect
        newSocket.connect();
      }
    });

    newSocket.io.on('reconnect_attempt', () => {
      set({ reconnecting: true });
    });

    newSocket.connect();
    set({ socket: newSocket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false, reconnecting: false, subscribedAssignments: new Set() });
    }
  },

  subscribeToAssignment: (assignmentId: string) => {
    const { socket, subscribedAssignments } = get();
    
    // Add to Set to track even if disconnected
    const newSubs = new Set(subscribedAssignments);
    newSubs.add(assignmentId);
    set({ subscribedAssignments: newSubs });

    if (socket?.connected) {
      socket.emit('assignment:join', { assignmentId });
    }
  },

  unsubscribeFromAssignment: (assignmentId: string) => {
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
    if (socket?.connected) {
      subscribedAssignments.forEach((assignmentId) => {
        socket.emit('assignment:join', { assignmentId });
      });
    }
  },

  updateLastEventTime: () => {
    set({ lastEventAt: Date.now() });
  }
}));
