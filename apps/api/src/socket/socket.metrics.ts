import { logger } from '@assessment-ai/logger';

export const socketMetrics = {
  trackConnection: (userId: string, totalActive: number) => {
    logger.info('Socket metrics: connection', { userId, totalActive });
  },
  trackAuthFailure: (reason: string) => {
    logger.warn('Socket metrics: auth failure', { reason });
  },
  trackRoomJoin: (room: string, userId: string) => {
    logger.info('Socket metrics: room join', { room, userId });
  }
};
