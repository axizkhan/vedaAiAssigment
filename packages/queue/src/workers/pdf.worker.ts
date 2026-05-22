import { Worker, Job } from 'bullmq';
import { logger } from '@assessment-ai/logger';
import { redisConnection } from '../redis.connection';
import { PDFJobPayload } from '../queue.types';
import { PDF_EVENTS } from '../events/pdf.events';
import { RetryableQueueError } from '../queue.errors';
import { deadLetterQueue } from '../queues/dead-letter.queue';

// Stub
const webSocketEmitter = { emit: (event: string, payload: any) => {} };

export const pdfWorker = new Worker<PDFJobPayload>(
  'pdf',
  async (job: Job<PDFJobPayload>) => {
    const { assignmentId, version, traceId } = job.data;
    logger.info('PDF job started', { jobId: job.id, assignmentId, version, traceId });

    webSocketEmitter.emit(PDF_EVENTS.STARTED, { assignmentId, traceId, timestamp: new Date().toISOString() });

    try {
      // Puppeteer rendering logic goes here
      // let browser;
      // try {
      //   browser = await puppeteer.launch();
      //   ...
      // } finally {
      //   if (browser) await browser.close();
      // }

      const fakeDownloadUrl = \`https://storage.veda.ai/pdf/\${assignmentId}-v\${version}.pdf\`;

      webSocketEmitter.emit(PDF_EVENTS.READY, { 
        assignmentId, 
        version, 
        downloadUrl: fakeDownloadUrl, 
        traceId, 
        timestamp: new Date().toISOString() 
      });

      return { success: true, downloadUrl: fakeDownloadUrl };
    } catch (error: any) {
      logger.error('PDF job failed', { jobId: job.id, assignmentId, traceId, error: error.message });
      
      if (job.attemptsMade >= (job.opts.attempts || 2) - 1) {
        // Ship to DLQ
        await deadLetterQueue.add('pdf-failure', {
          originalQueue: 'pdf',
          originalJobId: job.id!,
          assignmentId,
          traceId,
          error: { message: error.message, stack: error.stack },
          failedAt: new Date().toISOString(),
          attemptsMade: job.attemptsMade + 1
        });
      }

      throw new RetryableQueueError(error.message);
    }
  },
  {
    connection: redisConnection,
    concurrency: 4,
  }
);
