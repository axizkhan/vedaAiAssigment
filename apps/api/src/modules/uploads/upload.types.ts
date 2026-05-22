export interface UploadMetadata {
  traceId?: string;
  uploadedBy: string;
  assignmentId: string;
  uploadedAt: string;
  originalMimeType: string;
}

export interface MulterS3File extends Express.Multer.File {
  bucket: string;
  key: string;
  acl: string;
  contentType: string;
  contentDisposition: string;
  storageClass: string;
  serverSideEncryption: string;
  metadata: any;
  location: string;
  etag: string;
}
