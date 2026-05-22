import { logger } from '@assessment-ai/logger';

export const socketLogger = {
  info: (message: string, context?: Record<string, any>) => logger.info(message, context),
  warn: (message: string, context?: Record<string, any>) => logger.warn(message, context),
  error: (message: string, context?: Record<string, any>) => logger.error({ err: context?.error, ...context }, message)
};
