import { Socket } from 'socket.io';
import { AuthenticatedUser, AuthContext } from '../types/express';

export interface ServerToClientEvents {
  'generation:started': (data: { assignmentId: string }) => void;
  'generation:progress': (data: { assignmentId: string; progress: number; message: string }) => void;
  'generation:completed': (data: { assignmentId: string; version: number }) => void;
  'generation:failed': (data: { assignmentId: string; error: string }) => void;
  'pdf:ready': (data: { assignmentId: string; url: string }) => void;
  'queue:position': (data: { assignmentId: string; position: number }) => void;
  'error': (error: { code: string; message: string }) => void;
}

export interface ClientToServerEvents {
  'room:join': (data: { room: string }) => void;
  'room:leave': (data: { room: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  user: AuthenticatedUser;
  authContext: AuthContext & { connectedAt: Date; ipAddress: string };
}

export type AuthenticatedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
