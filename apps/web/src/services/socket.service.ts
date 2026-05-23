import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@assessment-ai/types/src/socket.types';

export const createSocketConnection = (token: string): Socket<ServerToClientEvents, ClientToServerEvents> => {
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

  return io(socketUrl, {
    auth: {
      token
    },
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
    autoConnect: false // We control the lifecycle manually
  });
};
