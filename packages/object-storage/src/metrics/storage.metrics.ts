import { logger } from '@assessment-ai/logger';

export const storageMetrics = {
  trackUpload: (data: { key: string; durationMs: number; success: boolean; error?: string; traceId?: string }) => {
    logger.info('Storage metrics: upload', data);
  },
  trackDownload: (data: { key: string; durationMs: number; success: boolean; error?: string; traceId?: string }) => {
    logger.info('Storage metrics: download', data);
  },
  trackSignedUrl: (data: { key: string; expiresInSeconds: number; traceId?: string }) => {
    logger.info('Storage metrics: signed_url_generated', data);
  }
};
