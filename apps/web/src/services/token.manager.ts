import { useAuthStore } from '../store/auth.store';

export const tokenManager = {
  getAccessToken: (): string | null => {
    return useAuthStore.getState().accessToken;
  },
  setAccessToken: (token: string, user: any) => {
    useAuthStore.getState().setAuth(user, token);
  },
  clearAccessToken: () => {
    useAuthStore.getState().clearAuth();
  },
  hasAccessToken: (): boolean => {
    return !!useAuthStore.getState().accessToken;
  }
};
