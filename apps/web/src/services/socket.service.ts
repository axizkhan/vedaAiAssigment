import { io, Socket } from 'socket.io-client';
import { tokenManager } from './token.manager';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (this.socket?.connected) return;

    const token = tokenManager.getAccessToken();
    if (!token) return;

    const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || '';

    this.socket = io(baseURL, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  syncToken(token: string) {
    if (this.socket) {
      // Update the auth payload for future reconnects natively
      this.socket.auth = { token };
      // Force a disconnect and reconnect to re-authenticate with the new token
      this.socket.disconnect().connect();
    } else {
      this.connect();
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
