import axios from 'axios';
import { requestQueue } from './request.queue';
import { tokenManager } from './token.manager';
import { normalizeApiError, ApiErrorCode } from './api.errors';
import { socketService } from './socket.service';
import { RefreshResult } from '../types/auth.types';

class RefreshOrchestrator {
  private isRefreshing = false;

  async refreshAccessToken(baseURL: string): Promise<string> {
    if (this.isRefreshing) {
      return requestQueue.enqueueRequest();
    }

    this.isRefreshing = true;

    try {
      const response = await axios.post<RefreshResult>(
        '/auth/refresh',
        {},
        {
          baseURL,
          withCredentials: true,
          headers: { 'x-trace-id': crypto.randomUUID() }
        }
      );

      const data = response.data.data;
      if (!data?.accessToken) throw new Error('Invalid refresh response');

      tokenManager.setAccessToken(data.accessToken, data.user);
      socketService.syncToken(data.accessToken);
      requestQueue.resolveQueuedRequests(data.accessToken);

      return data.accessToken;
    } catch (error) {
      const code = normalizeApiError(error);
      requestQueue.rejectQueuedRequests(error);

      const isNetworkError = axios.isAxiosError(error) && !error.response;

      if (!isNetworkError && (
        code === ApiErrorCode.INVALID_TOKEN ||
        code === ApiErrorCode.SESSION_REVOKED ||
        (error as any).response?.status === 401
      )) {
        tokenManager.clearAccessToken();
        requestQueue.clearQueue();
        socketService.disconnect();
        window.location.href = '/login'; // Force redirect to clear app state
      }

      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }
}

export const refreshOrchestrator = new RefreshOrchestrator();
