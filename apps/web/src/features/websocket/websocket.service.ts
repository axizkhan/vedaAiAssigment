import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@assessment-ai/types/src/socket.types';
import { useWebSocketStore } from './websocket.store';
import { WEBSOCKET_CONSTANTS } from './websocket.constants';

export const connectSocket = (accessToken: string): Socket<ServerToClientEvents, ClientToServerEvents> => {
  const socketUrl = process.env.NEXT_PUBLIC_WS_URL || '';
  
  const socket = io(socketUrl, {
    auth: { token: accessToken },
    reconnectionAttempts: WEBSOCKET_CONSTANTS.RECONNECTION_ATTEMPTS,
    reconnectionDelay: WEBSOCKET_CONSTANTS.RECONNECTION_DELAY,
    reconnectionDelayMax: WEBSOCKET_CONSTANTS.RECONNECTION_DELAY_MAX,
  });

  return socket;
};

export const disconnectSocket = (socket: Socket<ServerToClientEvents, ClientToServerEvents>) => {
  socket.disconnect();
};

export const joinAssignment = (assignmentId: string) => {
  useWebSocketStore.getState().subscribe(assignmentId);
};

export const leaveAssignment = (assignmentId: string) => {
  useWebSocketStore.getState().unsubscribe(assignmentId);
};

export const emitSafe = <Ev extends keyof ClientToServerEvents>(
  event: Ev,
  ...args: Parameters<ClientToServerEvents[Ev]>
) => {
  const socket = useWebSocketStore.getState().socket;
  if (socket?.connected) {
    // @ts-ignore - dynamic spread is hard to type precisely here
    socket.emit(event, ...args);
  } else {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[WS_SERVICE] Cannot emit ${String(event)} - socket disconnected`);
    }
  }
};

export const registerListeners = () => {
  // Base listeners are registered in the provider or hook layer
  // to ensure they have access to query client, but we expose
  // this interface to meet architectural requirements.
};

export const cleanupListeners = (socket: Socket<ServerToClientEvents, ClientToServerEvents>) => {
  if (socket) {
    socket.offAny();
  }
};
