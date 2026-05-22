import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getS3Client, getS3Bucket } from '../client/s3.client';
import { storageMetrics } from '../metrics/storage.metrics';
import { logger } from '@assessment-ai/logger';

export const getSignedUrl = async (
  key: string,
  expiresInSeconds: number = 3600,
  traceId?: string
): Promise<string> => {
  try {
    const command = new GetObjectCommand({
      Bucket: getS3Bucket(),
      Key: key,
    });

    const url = await awsGetSignedUrl(getS3Client(), command, { expiresIn: expiresInSeconds });
    storageMetrics.trackSignedUrl({ key, expiresInSeconds, traceId });
    return url;
  } catch (error: any) {
    logger.error('Failed to generate signed url', { key, error: error.message, traceId });
    throw error;
  }
};
