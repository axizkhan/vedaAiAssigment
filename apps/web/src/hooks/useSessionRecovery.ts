import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import { refreshOrchestrator } from '../services/refresh.orchestrator';

export const useSessionRecovery = () => {
  const { isAuthenticated, authInitialized, setInitialized, clearAuth } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    const recoverSession = async () => {
      if (isAuthenticated || authInitialized) {
        if (mounted && !authInitialized) setInitialized(true);
        return;
      }

      try {
        // Attempt silent refresh
        const baseURL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
        await refreshOrchestrator.refreshAccessToken(baseURL);
      } catch (error) {
        // Ensure state is cleared on failure (orchestrator handles redirect if critical)
        if (mounted) clearAuth();
      } finally {
        if (mounted) setInitialized(true);
      }
    };

    recoverSession();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, authInitialized, setInitialized, clearAuth]);

  return { authInitialized, isAuthenticated };
};
