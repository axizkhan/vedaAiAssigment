import { uploadBuffer } from './upload-buffer';
import { objectPathBuilder } from '../utils/object-path-builder';
import { validateUploadRequest } from '../security/upload-validator';

export interface UploadFileInput {
  assignmentId: string;
  userId?: string;
  filename: string;
  buffer: Buffer;
  contentType: string;
  metadata?: Record<string, string>;
  traceId?: string;
}

export const uploadFile = async (input: UploadFileInput): Promise<string> => {
  const { assignmentId, userId = 'system', filename, buffer, contentType, traceId } = input;
  
  validateUploadRequest(filename, contentType, buffer.length);
  
  const key = objectPathBuilder.assignmentUpload(userId, assignmentId, filename);
  
  await uploadBuffer(key, buffer, contentType, traceId);
  
  return key;
};
