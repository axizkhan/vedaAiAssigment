import { QueryClient } from '@tanstack/react-query';
import { Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@assessment-ai/types/src/socket.types';
import { useWebSocketStore } from './websocket.store';
import { isStaleEvent } from './websocket.utils';
import { validatePayload, generationProgressSchema, generationCompletedSchema } from './websocket.validators';

export const registerSocketEvents = (
  socket: Socket<ServerToClientEvents, ClientToServerEvents>,
  queryClient: QueryClient
) => {
  socket.on('generation:started', (payload) => {
    useWebSocketStore.getState().setLastEvent();
    queryClient.invalidateQueries({ queryKey: ['assignment', payload.assignmentId] });
    queryClient.invalidateQueries({ queryKey: ['generation', payload.assignmentId] });
  });

  socket.on('generation:progress', (payload) => {
    const valid = validatePayload(generationProgressSchema, payload);
    if (!valid) return;

    useWebSocketStore.getState().setLastEvent();
    
    // In a real app we might update the query cache optimistically here
    queryClient.setQueryData(['generation', valid.assignmentId], (oldData: any) => {
      // Prevent stale updates if we already have a higher step/percent
      if (oldData && oldData.step > valid.step) return oldData;
      if (oldData && oldData.step === valid.step && oldData.percent >= valid.percent) return oldData;
      return { ...oldData, ...valid };
    });
  });

  socket.on('generation:completed', ({ assignmentId, traceId }) => {
    useWebSocketStore.getState().setLastEvent();
    queryClient.invalidateQueries({ queryKey: ['assignment', assignmentId] });
    queryClient.invalidateQueries({ queryKey: ['paper', assignmentId] });
    queryClient.invalidateQueries({ queryKey: ['generation', assignmentId] });
  });

  socket.on('generation:failed', (payload) => {
    useWebSocketStore.getState().setLastEvent();
    queryClient.invalidateQueries({ queryKey: ['assignment', payload.assignmentId] });
    queryClient.invalidateQueries({ queryKey: ['generation', payload.assignmentId] });
  });

  socket.on('pdf:ready', (payload) => {
    useWebSocketStore.getState().setLastEvent();
    queryClient.invalidateQueries({ queryKey: ['pdf', payload.assignmentId] });
    queryClient.invalidateQueries({ queryKey: ['assignment', payload.assignmentId] });
  });

  socket.on('queue:position', (payload) => {
    useWebSocketStore.getState().setLastEvent();
    queryClient.setQueryData(['queue', payload.assignmentId], (oldData: any) => {
      return { ...oldData, position: payload.position };
    });
  });
};
