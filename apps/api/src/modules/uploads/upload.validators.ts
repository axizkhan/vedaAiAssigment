import { UploadValidationError, UploadMimeError } from './upload.errors';
import { validateFilenameSecurity } from './upload.security';
import { resolveMimeType } from './upload.mime';

export const validateIncomingFile = (req: Express.Request, file: Express.Multer.File): void => {
  if (!file) {
    throw new UploadValidationError('No file provided');
  }

  validateFilenameSecurity(file.originalname);

  const resolvedMime = resolveMimeType(file.mimetype, file.originalname);
  if (!resolvedMime) {
    throw new UploadMimeError('Invalid file format. Only PDF and TXT files are allowed.');
  }
};
