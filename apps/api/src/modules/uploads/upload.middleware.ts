import multer from 'multer';
import multerS3 from 'multer-s3';
import { getS3Client, getS3Bucket } from '@assessment-ai/object-storage';
import { validateIncomingFile } from './upload.validators';
import { generateObjectKey } from './upload.utils';
import { UPLOAD_CONSTANTS } from './upload.constants';
import { UploadAudit } from './upload.audit';
import { Request } from 'express';
import { UploadStorageError, UploadTimeoutError } from './upload.errors';

const s3Client = getS3Client();

export const uploadMiddleware = multer({
  limits: {
    fileSize: UPLOAD_CONSTANTS.MAX_FILE_SIZE_BYTES,
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    try {
      validateIncomingFile(req, file);
      cb(null, true);
    } catch (error: any) {
      // Multer expects an Error for rejection
      cb(error);
    }
  },
  storage: multerS3({
    s3: s3Client,
    bucket: getS3Bucket(),
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req: Request, file: Express.Multer.File, cb) => {
      const traceId = req.headers['x-trace-id'] as string || 'unknown';
      cb(null, {
        traceId,
        uploadedBy: req.user?.id || 'unknown',
        assignmentId: req.params.id || 'unknown',
        uploadedAt: new Date().toISOString(),
        originalMimeType: file.mimetype,
      });
    },
    key: (req: Request, file: Express.Multer.File, cb) => {
      try {
        const userId = req.user?.id || 'unknown';
        const assignmentId = req.params.id || 'unknown';
        const traceId = req.headers['x-trace-id'] as string;
        
        const objectKey = generateObjectKey(userId, assignmentId, file.originalname);
        
        UploadAudit.uploadStarted(assignmentId, userId, file.originalname, traceId);
        
        cb(null, objectKey);
      } catch (err: any) {
        cb(err);
      }
    }
});

// Wrapper middleware to enforce the strict 30s timeout on uploads
export const uploadWithTimeout = (req: Request, res: any, next: any) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    next(new UploadTimeoutError(`Upload timed out after ${UPLOAD_CONSTANTS.UPLOAD_TIMEOUT_MS}ms`));
  }, UPLOAD_CONSTANTS.UPLOAD_TIMEOUT_MS);

  // Attach abort signal to request so AWS SDK can pick it up if supported, 
  // or just fail the request downstream
  req.on('end', () => clearTimeout(timeoutId));
  req.on('error', () => clearTimeout(timeoutId));

  uploadMiddleware.single('file')(req, res, (err) => {
    clearTimeout(timeoutId);
    if (controller.signal.aborted) return;
    next(err);
  });
};
