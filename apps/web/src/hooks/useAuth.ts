import { useAuthStore } from '../store/auth.store';
import { authService } from '../services/auth.service';

export const useAuth = () => {
  const store = useAuthStore();
  
  return {
    ...store,
    login: authService.login,
    logout: async () => {
      await authService.logout();
      store.clearAuth();
    }
  };
};
