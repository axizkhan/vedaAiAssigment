import { Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from '@assessment-ai/types/src/socket.types';

export interface SocketData {
  userId: string;
  traceId: string;
  role?: string;
  sessionId?: string;
}

export type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>;
