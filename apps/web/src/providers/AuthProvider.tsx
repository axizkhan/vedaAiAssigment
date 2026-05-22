import React from 'react';
import { useSessionRecovery } from '../hooks/useSessionRecovery';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authInitialized } = useSessionRecovery();

  if (!authInitialized) {
    // Return a minimal loading state while we attempt silent refresh
    // This prevents flash-of-unauthenticated-content
    return null; 
  }

  return <>{children}</>;
};
