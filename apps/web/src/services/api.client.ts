import axios from 'axios';
import { tokenManager } from './token.manager';
import { refreshOrchestrator } from './refresh.orchestrator';
import { normalizeApiError, ApiErrorCode } from './api.errors';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
  timeout: 15000,
  withCredentials: true
});

apiClient.interceptors.request.use((config) => {
  const token = tokenManager.getAccessToken();
  
  // Attach auth header if token exists and request is to internal API
  if (token && config.baseURL && config.url && !config.url.startsWith('http')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Attach trace ID
  if (!config.headers['x-trace-id']) {
    config.headers['x-trace-id'] = crypto.randomUUID();
  }
  
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const errorCode = normalizeApiError(error);

    if (errorCode === ApiErrorCode.TOKEN_EXPIRED && !originalRequest._retry) {
      // Prevent recursive retries for endpoints like refresh/logout
      if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/logout')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const newToken = await refreshOrchestrator.refreshAccessToken(apiClient.defaults.baseURL!);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
