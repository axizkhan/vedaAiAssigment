import { S3ClientManager } from "../client/s3.client";
import { logger } from "@assessment-ai/logger";
import { FileNotFoundError } from "../utils/storage-errors";

export interface GetSignedUrlOptions {
  objectKey: string;
  expiresIn?: number;
  traceId?: string;
}

/**
 * Generate a signed URL for downloading a file from S3/MinIO
 * Default expiration: 1 hour (3600 seconds)
 */
export async function getSignedDownloadUrl(
  options: GetSignedUrlOptions,
): Promise<string> {
  const { objectKey, expiresIn = 3600, traceId } = options;

  try {
    const url = await S3ClientManager.getSignedDownloadUrl(
      objectKey,
      expiresIn,
    );
    logger.debug(
      { objectKey, expiresIn, traceId },
      "Signed download URL generated",
    );
    return url;
  } catch (error) {
    logger.error(
      { objectKey, error, traceId },
      "Failed to generate signed URL",
    );
    throw new FileNotFoundError("Cannot generate download URL for file");
  }
}
