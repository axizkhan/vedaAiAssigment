import { logger } from '@assessment-ai/logger';

export const socketMetrics = {
  trackConnection: () => {
    logger.info('Socket connected', { event: 'socket_connection_established' });
  },
  trackDisconnection: (reason: string) => {
    logger.info('Socket disconnected', { event: 'socket_disconnected', reason });
  },
  trackAuthFailure: (error: string) => {
    logger.warn('Socket authentication failed', { event: 'socket_auth_failure', error });
  },
  trackEventEmitted: (eventName: string, room: string) => {
    logger.debug('Socket event emitted', { event: 'socket_event_emitted', eventName, room });
  }
};
