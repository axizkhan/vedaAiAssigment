import express from 'express';
import { logger } from '@assessment-ai/logger';
import { apiEnv } from '@assessment-ai/config';
import { S3ClientManager } from '@assessment-ai/object-storage';
import { sendSuccessResponse } from './common/response';
import { errorMiddleware, traceIdMiddleware } from './middleware/error.middleware';
import { authRouter } from './modules/auth';
import { assignmentRouter } from './modules/assignments';
import { uploadsRouter } from './modules/uploads';
import { uploadService } from './modules/uploads/upload.service';

const app = express();
const port = apiEnv.PORT;

// Initialize S3 storage
try {
  S3ClientManager.initialize({
    endpoint: apiEnv.S3_ENDPOINT,
    region: apiEnv.S3_REGION,
    credentials: {
      accessKeyId: apiEnv.S3_ACCESS_KEY,
      secretAccessKey: apiEnv.S3_SECRET_KEY,
    },
    bucket: apiEnv.S3_BUCKET,
    forcePathStyle: apiEnv.S3_FORCE_PATH_STYLE,
  });
  uploadService.initializeStorage({
    endpoint: apiEnv.S3_ENDPOINT,
    region: apiEnv.S3_REGION,
    credentials: {
      accessKeyId: apiEnv.S3_ACCESS_KEY,
      secretAccessKey: apiEnv.S3_SECRET_KEY,
    },
    bucket: apiEnv.S3_BUCKET,
    forcePathStyle: apiEnv.S3_FORCE_PATH_STYLE,
  });
  logger.info('S3/MinIO storage initialized successfully');
} catch (error) {
  logger.error({ error }, 'Failed to initialize S3 storage');
  process.exit(1);
}

app.use(express.json());
app.use(traceIdMiddleware);

app.get('/health', (req, res) => {
  return sendSuccessResponse(res, {
    data: { status: 'ok' },
    traceId: req.traceId,
  });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/assignments', assignmentRouter);
app.use('/api/v1/assignments', uploadsRouter);

app.use(errorMiddleware);

app.listen(port, () => {
  logger.info(`API listening on port ${port}`);
});
