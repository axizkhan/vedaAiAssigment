import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getS3Client, getS3Bucket } from '../client/s3.client';
import { StorageUploadResult } from '../types/storage.types';
import { storageMetrics } from '../metrics/storage.metrics';

export const uploadBuffer = async (
  key: string,
  buffer: Buffer,
  contentType: string,
  traceId?: string
): Promise<StorageUploadResult> => {
  const startTime = Date.now();
  try {
    const command = new PutObjectCommand({
      Bucket: getS3Bucket(),
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await getS3Client().send(command);
    
    const durationMs = Date.now() - startTime;
    storageMetrics.trackUpload({ key, durationMs, success: true, traceId });
    
    return { key, success: true };
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    storageMetrics.trackUpload({ key, durationMs, success: false, error: error.message, traceId });
    throw error;
  }
};
