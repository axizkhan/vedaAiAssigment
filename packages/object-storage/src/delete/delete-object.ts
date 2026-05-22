import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getS3Client, getS3Bucket } from '../client/s3.client';
import { logger } from '@assessment-ai/logger';

export const deleteObject = async (key: string, traceId?: string): Promise<void> => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: getS3Bucket(),
      Key: key,
    });
    await getS3Client().send(command);
    logger.info('Deleted object', { key, traceId });
  } catch (error: any) {
    logger.error('Failed to delete object', { key, error: error.message, traceId });
    throw error;
  }
};
