import {
  S3Client,
  S3ClientConfig,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { logger } from "@assessment-ai/logger";

interface S3Config {
  endpoint?: string;
  region: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  bucket: string;
  forcePathStyle?: boolean;
}

class S3ClientManager {
  private static instance: S3Client | null = null;
  private static config: S3Config | null = null;

  static initialize(config: S3Config): void {
    if (this.instance) {
      logger.warn("S3Client already initialized. Skipping re-initialization.");
      return;
    }

    this.config = config;

    const clientConfig: S3ClientConfig = {
      region: config.region,
      credentials: {
        accessKeyId: config.credentials.accessKeyId,
        secretAccessKey: config.credentials.secretAccessKey,
      },
    };

    if (config.endpoint) {
      clientConfig.endpoint = config.endpoint;
      if (config.forcePathStyle !== false) {
        clientConfig.forcePathStyle = true;
      }
    }

    this.instance = new S3Client(clientConfig);
    logger.info(
      { endpoint: config.endpoint, region: config.region },
      "S3Client initialized",
    );
  }

  static getInstance(): S3Client {
    if (!this.instance) {
      throw new Error(
        "S3Client not initialized. Call S3ClientManager.initialize() first.",
      );
    }
    return this.instance;
  }

  static getConfig(): S3Config {
    if (!this.config) {
      throw new Error(
        "S3Config not set. Call S3ClientManager.initialize() first.",
      );
    }
    return this.config;
  }

  static async putObject(
    key: string,
    body: Buffer | Uint8Array | string,
    contentType: string,
    metadata?: Record<string, string>,
  ): Promise<void> {
    const client = this.getInstance();
    const config = this.getConfig();

    try {
      const command = new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        Metadata: metadata,
      });

      await client.send(command);
      logger.debug({ bucket: config.bucket, key }, "Object uploaded to S3");
    } catch (error) {
      logger.error({ bucket: config.bucket, key, error }, "S3 upload failed");
      throw error;
    }
  }

  static async getObject(key: string): Promise<{
    body: AsyncIterable<Uint8Array>;
    contentType?: string;
  }> {
    const client = this.getInstance();
    const config = this.getConfig();

    try {
      const command = new GetObjectCommand({
        Bucket: config.bucket,
        Key: key,
      });

      const response = await client.send(command);
      return {
        body: response.Body as AsyncIterable<Uint8Array>,
        contentType: response.ContentType,
      };
    } catch (error) {
      logger.error({ bucket: config.bucket, key, error }, "S3 download failed");
      throw error;
    }
  }

  static async getSignedDownloadUrl(
    key: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    const client = this.getInstance();
    const config = this.getConfig();

    try {
      const command = new GetObjectCommand({
        Bucket: config.bucket,
        Key: key,
      });

      const url = await getSignedUrl(client, command, { expiresIn });
      logger.debug(
        { bucket: config.bucket, key },
        "Signed download URL generated",
      );
      return url;
    } catch (error) {
      logger.error(
        { bucket: config.bucket, key, error },
        "Failed to generate signed URL",
      );
      throw error;
    }
  }

  static async headObject(
    key: string,
  ): Promise<{ contentLength: number; contentType?: string }> {
    const client = this.getInstance();
    const config = this.getConfig();

    try {
      const command = new HeadObjectCommand({
        Bucket: config.bucket,
        Key: key,
      });

      const response = await client.send(command);
      return {
        contentLength: response.ContentLength ?? 0,
        contentType: response.ContentType,
      };
    } catch (error) {
      logger.error(
        { bucket: config.bucket, key, error },
        "S3 head object failed",
      );
      throw error;
    }
  }
}

export { S3ClientManager };
export type { S3Config };
