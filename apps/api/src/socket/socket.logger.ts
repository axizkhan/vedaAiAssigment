import { logger } from '@assessment-ai/logger';

export const socketLogger = {
  info: (message: string, meta: { socketId: string; userId?: string; traceId?: string; assignmentId?: string; event: string; timestamp: string }) => {
    logger.info(message, meta);
  },
  warn: (message: string, meta: { socketId: string; userId?: string; traceId?: string; assignmentId?: string; event: string; timestamp: string; error?: string }) => {
    logger.warn(message, meta);
  },
  error: (message: string, meta: { socketId: string; userId?: string; traceId?: string; assignmentId?: string; event: string; timestamp: string; error: string }) => {
    logger.error(message, meta);
  }
};
