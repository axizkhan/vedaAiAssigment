import { useEffect } from 'react';
import { useWebSocketStore } from '../store/websocket.store';
import { SOCKET_EVENTS } from '@assessment-ai/types/src/socket.constants';
import { 
  GenerationProgressPayload, 
  PdfReadyPayload, 
  QueuePositionPayload 
} from '@assessment-ai/types/src/socket.payloads';

export const useSocketEvents = (assignmentId: string) => {
  const socket = useWebSocketStore((state) => state.socket);
  const subscribeToAssignment = useWebSocketStore((state) => state.subscribeToAssignment);
  const unsubscribeFromAssignment = useWebSocketStore((state) => state.unsubscribeFromAssignment);
  const updateLastEventTime = useWebSocketStore((state) => state.updateLastEventTime);

  useEffect(() => {
    if (assignmentId) {
      subscribeToAssignment(assignmentId);
    }
    return () => {
      if (assignmentId) {
        unsubscribeFromAssignment(assignmentId);
      }
    };
  }, [assignmentId, subscribeToAssignment, unsubscribeFromAssignment]);

  return { socket, updateLastEventTime };
};

export const useGenerationEvents = (assignmentId: string, onProgress: (data: GenerationProgressPayload) => void, onComplete: () => void, onFailed: (error: string) => void) => {
  const { socket, updateLastEventTime } = useSocketEvents(assignmentId);

  useEffect(() => {
    if (!socket) return;

    const handleProgress = (data: GenerationProgressPayload) => {
      updateLastEventTime();
      onProgress(data);
    };

    const handleCompleted = () => {
      updateLastEventTime();
      onComplete();
      // In a real app, queryClient.invalidateQueries({ queryKey: ['assignment', assignmentId] })
    };

    const handleFailed = (data: { message: string }) => {
      updateLastEventTime();
      onFailed(data.message);
    };

    socket.on(SOCKET_EVENTS.GENERATION_PROGRESS, handleProgress);
    socket.on(SOCKET_EVENTS.GENERATION_COMPLETED, handleCompleted);
    socket.on(SOCKET_EVENTS.GENERATION_FAILED, handleFailed);

    return () => {
      socket.off(SOCKET_EVENTS.GENERATION_PROGRESS, handleProgress);
      socket.off(SOCKET_EVENTS.GENERATION_COMPLETED, handleCompleted);
      socket.off(SOCKET_EVENTS.GENERATION_FAILED, handleFailed);
    };
  }, [socket, onProgress, onComplete, onFailed, updateLastEventTime]);
};

export const usePdfEvents = (assignmentId: string, onPdfReady: (data: PdfReadyPayload) => void) => {
  const { socket } = useSocketEvents(assignmentId);

  useEffect(() => {
    if (!socket) return;

    const handlePdfReady = (data: PdfReadyPayload) => {
      onPdfReady(data);
    };

    socket.on(SOCKET_EVENTS.PDF_READY, handlePdfReady);

    return () => {
      socket.off(SOCKET_EVENTS.PDF_READY, handlePdfReady);
    };
  }, [socket, onPdfReady]);
};

export const useQueueEvents = (assignmentId: string, onQueuePosition: (data: QueuePositionPayload) => void) => {
  const { socket } = useSocketEvents(assignmentId);

  useEffect(() => {
    if (!socket) return;

    const handleQueuePosition = (data: QueuePositionPayload) => {
      onQueuePosition(data);
    };

    socket.on(SOCKET_EVENTS.QUEUE_POSITION, handleQueuePosition);

    return () => {
      socket.off(SOCKET_EVENTS.QUEUE_POSITION, handleQueuePosition);
    };
  }, [socket, onQueuePosition]);
};
