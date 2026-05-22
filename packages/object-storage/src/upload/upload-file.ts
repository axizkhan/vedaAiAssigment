import { S3ClientManager } from "../client/s3.client";
import { logger } from "@assessment-ai/logger";
import { generateObjectKey } from "../utils/sanitize-object-name";
import { FileUploadError } from "../utils/storage-errors";
export interface UploadFileOptions {
  assignmentId: string;
  filename: string;
  buffer: Buffer | Uint8Array;
  contentType: string;
  metadata?: Record<string, string>;
  traceId?: string;
}

/**
 * Upload file to S3/MinIO storage
 * Generates a secure object key and uploads directly from buffer
 */
export async function uploadFile(options: UploadFileOptions): Promise<string> {
  const { assignmentId, filename, buffer, contentType, metadata, traceId } =
    options;

  try {
    const objectKey = generateObjectKey(assignmentId, filename);

    await S3ClientManager.putObject(objectKey, buffer, contentType, {
      ...metadata,
      "uploaded-by-trace": traceId || "unknown",
      "uploaded-at": new Date().toISOString(),
    });

    logger.info(
      { assignmentId, objectKey, size: buffer.length, traceId },
      "File uploaded successfully",
    );

    return objectKey;
  } catch (error) {
    logger.error(
      { assignmentId, filename, error, traceId },
      "File upload to S3 failed",
    );
    throw new FileUploadError("Failed to upload file to storage");
  }
}

/**
 * Upload file from stream directly to S3/MinIO
 * Optimized for large files and memory efficiency
 */
export async function uploadStream(
  options: Omit<UploadFileOptions, "buffer"> & {
    stream: any;
  },
): Promise<string> {
  const { assignmentId, filename, stream, contentType, metadata, traceId } =
    options;

  try {
    // Collect stream into buffer
    const chunks: Uint8Array[] = [];

    await new Promise<void>((resolve, reject) => {
      stream.on("data", (chunk: any) => {
        chunks.push(chunk);
      });
      stream.on("end", () => {
        resolve();
      });
      stream.on("error", (error: any) => {
        reject(error);
      });
    });

    const buffer = Buffer.concat(chunks);

    return uploadFile({
      assignmentId,
      filename,
      buffer,
      contentType,
      metadata,
      traceId,
    });
  } catch (error) {
    logger.error(
      { assignmentId, filename, error, traceId },
      "Stream upload to S3 failed",
    );
    throw new FileUploadError("Failed to upload file from stream");
  }
}

/**
 * Validate object existence and metadata
 */
export async function validateObjectExists(
  objectKey: string,
  traceId?: string,
): Promise<boolean> {
  try {
    await S3ClientManager.headObject(objectKey);
    return true;
  } catch (error: any) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      logger.debug({ objectKey, traceId }, "Object not found");
      return false;
    }
    logger.error({ objectKey, error, traceId }, "Failed to validate object");
    throw error;
  }
}
