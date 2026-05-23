import { useEffect } from 'react';
import { useWebSocketStore } from '../store/websocket.store';

// Stub for React Query / Fetching
const fetchAssignmentStatus = async (id: string) => {
  // const res = await fetch(\`/api/assignments/\${id}/status\`);
  // return res.json();
  return { status: 'mock' };
};

export const useGenerationSync = (assignmentId: string, currentStatus: string) => {
  const isConnected = useWebSocketStore((state) => state.isConnected);
  const lastEventAt = useWebSocketStore((state) => state.lastEventAt);

  useEffect(() => {
    // Only poll if we are supposedly generating but the socket is dead, 
    // OR we haven't received an event in over 15 seconds (suspect dropped packet)
    const isActivelyGenerating = currentStatus === 'QUEUED' || currentStatus === 'GENERATING';
    const socketSuspect = !isConnected || (lastEventAt && Date.now() - lastEventAt > 15000);

    if (isActivelyGenerating && socketSuspect) {
      const interval = setInterval(() => {
        fetchAssignmentStatus(assignmentId).then((data) => {
          // If data.status === 'COMPLETED', we manually trigger the query invalidation here
          console.log('[Sync Fallback] Polled status:', data.status);
        });
      }, 5000); // 5 second hybrid fallback

      return () => clearInterval(interval);
    }
  }, [assignmentId, currentStatus, isConnected, lastEventAt]);
};
