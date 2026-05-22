import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getS3Client, getS3Bucket } from '../client/s3.client';
import { Readable } from 'stream';
import { logger } from '@assessment-ai/logger';
import { storageMetrics } from '../metrics/storage.metrics';

export const streamObject = async (key: string, traceId?: string): Promise<Readable> => {
  const startTime = Date.now();
  try {
    const command = new GetObjectCommand({
      Bucket: getS3Bucket(),
      Key: key,
    });

    const response = await getS3Client().send(command);
    if (!response.Body) {
      throw new Error('Object body is empty');
    }

    storageMetrics.trackDownload({ key, durationMs: Date.now() - startTime, success: true, traceId });
    return response.Body as Readable;
  } catch (error: any) {
    storageMetrics.trackDownload({ key, durationMs: Date.now() - startTime, success: false, error: error.message, traceId });
    logger.error('Failed to stream object', { key, traceId, error: error.message });
    throw error;
  }
};
