import { UPLOAD_CONSTANTS } from './upload.constants';

export const resolveMimeType = (mimeType: string, filename: string): string | null => {
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  
  if (mimeType === UPLOAD_CONSTANTS.ALLOWED_MIME_TYPES.PDF && ext === '.pdf') {
    return mimeType;
  }
  if (mimeType === UPLOAD_CONSTANTS.ALLOWED_MIME_TYPES.TXT && ext === '.txt') {
    return mimeType;
  }
  
  return null;
};
