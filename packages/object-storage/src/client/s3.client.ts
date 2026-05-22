import { S3Client } from '@aws-sdk/client-s3';
import { apiEnv } from '@assessment-ai/config';
import { logger } from '@assessment-ai/logger';
import { retryPolicy } from '../utils/retry-policy';

class S3ClientManager {
  private static instance: S3Client | null = null;
  private static config: { bucket: string } | null = null;

  public static initialize() {
    if (this.instance) return;

    this.instance = new S3Client({
      endpoint: apiEnv.S3_ENDPOINT,
      region: apiEnv.S3_REGION,
      credentials: {
        accessKeyId: apiEnv.S3_ACCESS_KEY,
        secretAccessKey: apiEnv.S3_SECRET_KEY,
      },
      forcePathStyle: apiEnv.S3_FORCE_PATH_STYLE,
    });

    this.config = { bucket: apiEnv.S3_BUCKET };
    logger.info('S3 Client initialized', { endpoint: apiEnv.S3_ENDPOINT, bucket: apiEnv.S3_BUCKET });
  }

  public static getInstance(): S3Client {
    if (!this.instance) {
      this.initialize();
    }
    return this.instance!;
  }

  public static getBucket(): string {
    if (!this.config) {
      this.initialize();
    }
    return this.config!.bucket;
  }
}

export const getS3Client = () => S3ClientManager.getInstance();
export const getS3Bucket = () => S3ClientManager.getBucket();
