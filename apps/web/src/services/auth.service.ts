import { apiClient } from './api.client';
import { tokenManager } from './token.manager';
import { requestQueue } from './request.queue';
import { socketService } from './socket.service';

export const authService = {
  login: async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    const { accessToken, user } = res.data.data;
    tokenManager.setAccessToken(accessToken, user);
    socketService.connect();
    return res.data;
  },
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // Ignore network errors during logout, proceed to local cleanup
    } finally {
      tokenManager.clearAccessToken();
      requestQueue.clearQueue();
      socketService.disconnect();
      window.location.href = '/login';
    }
  }
};
