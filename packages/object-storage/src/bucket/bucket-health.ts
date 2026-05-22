import { HeadBucketCommand } from '@aws-sdk/client-s3';
import { getS3Client, getS3Bucket } from '../client/s3.client';
import { StorageHealthResult } from '../types/storage.types';

export const checkStorageHealth = async (): Promise<StorageHealthResult> => {
  const startTime = Date.now();
  try {
    const command = new HeadBucketCommand({ Bucket: getS3Bucket() });
    await getS3Client().send(command);
    return {
      status: 'healthy',
      latencyMs: Date.now() - startTime,
      checkedAt: new Date()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      latencyMs: Date.now() - startTime,
      checkedAt: new Date()
    };
  }
};
