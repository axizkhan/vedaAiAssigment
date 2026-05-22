import { ErrorRequestHandler } from 'express';
import { MulterError } from 'multer';
import { UploadSizeLimitError, UploadError } from './upload.errors';
import { logger } from '@assessment-ai/logger';

export const multerErrorMapper: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof MulterError) {
    logger.warn('Multer internal error mapped', { code: err.code });
    if (err.code === 'LIMIT_FILE_SIZE') {
      next(new UploadSizeLimitError('File size exceeds the 10MB limit'));
    } else {
      next(new UploadError('File upload error', 'UPLOAD_FAILED', 400));
    }
  } else {
    next(err);
  }
};
