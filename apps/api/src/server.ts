import express from 'express';
import { logger } from '@assessment-ai/logger';
import { apiEnv } from '@assessment-ai/config';
import { sendSuccessResponse } from './common/response';
import { errorMiddleware, traceIdMiddleware } from './middleware/error.middleware';
import { authRouter } from './modules/auth';

const app = express();
const port = apiEnv.PORT;

app.use(express.json());
app.use(traceIdMiddleware);

app.get('/health', (req, res) => {
  return sendSuccessResponse(res, {
    data: { status: 'ok' },
    traceId: req.traceId,
  });
});

app.use('/api/v1/auth', authRouter);

app.use(errorMiddleware);

app.listen(port, () => {
  logger.info(`API listening on port ${port}`);
});
