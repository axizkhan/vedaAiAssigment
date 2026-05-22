import express from 'express';
import { logger } from '@assessment-ai/logger';
import { apiEnv } from '@assessment-ai/config';

const app = express();
const port = apiEnv.PORT;

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  logger.info(`API listening on port ${port}`);
});
