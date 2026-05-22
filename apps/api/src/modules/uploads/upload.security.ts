import { UploadSecurityError } from './upload.errors';

export const validateFilenameSecurity = (filename: string): void => {
  if (!filename) {
    throw new UploadSecurityError('Filename is empty');
  }

  // Prevent null bytes
  if (filename.indexOf('\\0') !== -1) {
    throw new UploadSecurityError('Filename contains null bytes');
  }

  // Prevent path traversal
  if (filename.includes('/') || filename.includes('\\\\') || filename.includes('..')) {
    throw new UploadSecurityError('Filename contains path traversal characters');
  }

  // Prevent dangerous extensions
  const lowerFilename = filename.toLowerCase();
  const dangerousExts = ['.exe', '.sh', '.bat', '.js', '.php', '.cmd', '.vbs', '.scr'];
  if (dangerousExts.some(ext => lowerFilename.endsWith(ext))) {
    throw new UploadSecurityError('Dangerous file extension detected');
  }
};
