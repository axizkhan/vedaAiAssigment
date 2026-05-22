import { Readable } from 'stream';

export interface StorageUploadInput {
  key: string;
  data: Buffer | Readable;
  contentType: string;
  traceId?: string;
}

export interface StorageUploadResult {
  key: string;
  success: boolean;
}

export interface StorageDownloadResult {
  key: string;
  stream: Readable;
}

export interface StorageHealthResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  latencyMs: number;
  checkedAt: Date;
}

export interface ObjectMetadata {
  contentType: string;
  contentLength: number;
  eTag: string;
  lastModified: Date;
}
