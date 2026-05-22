import { Upload } from '@aws-sdk/lib-storage';
import { getS3Client, getS3Bucket } from '../client/s3.client';
import { Readable } from 'stream';
import { logger } from '@assessment-ai/logger';
import { StorageUploadResult } from '../types/storage.types';
import { storageMetrics } from '../metrics/storage.metrics';

export const uploadStream = async (
  key: string,
  stream: Readable | Buffer,
  contentType: string,
  traceId?: string
): Promise<StorageUploadResult> => {
  const startTime = Date.now();
  try {
    const upload = new Upload({
      client: getS3Client(),
      params: {
        Bucket: getS3Bucket(),
        Key: key,
        Body: stream,
        ContentType: contentType,
      },
    });

    await upload.done();
    const durationMs = Date.now() - startTime;
    
    storageMetrics.trackUpload({ key, durationMs, success: true, traceId });
    return { key, success: true };
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    storageMetrics.trackUpload({ key, durationMs, success: false, error: error.message, traceId });
    throw error;
  }
};
