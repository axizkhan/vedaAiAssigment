import { create } from 'zustand';
import { AuthenticatedUser } from '../types/auth.types';

interface AuthState {
  user: AuthenticatedUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  authInitialized: boolean;
  
  setAuth: (user: AuthenticatedUser, token: string) => void;
  clearAuth: () => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  authInitialized: false,
  
  setAuth: (user, token) => set({ user, accessToken: token, isAuthenticated: true, authInitialized: true }),
  clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false, authInitialized: true }),
  setInitialized: (initialized) => set({ authInitialized: initialized })
}));
