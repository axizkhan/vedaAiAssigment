import { Worker } from 'bullmq';
import { redis } from '@assessment-ai/redis';
import { logger } from '@assessment-ai/logger';
import { PuppeteerRenderer } from '@assessment-ai/pdf/src/renderer/puppeteer.renderer';
import { uploadBuffer, objectPathBuilder } from '@assessment-ai/object-storage';

export const pdfWorker = new Worker('pdf', async (job) => {
  logger.info('Processing PDF job ' + job.id);
  
  const { html, assignmentId, version, traceId } = job.data;
  
  // Render HTML to PDF Buffer strictly in memory
  const renderer = new PuppeteerRenderer();
  const pdfBuffer = await renderer.renderHtmlToPdf(html || '<h1>Default Assessment</h1>');
  await job.updateProgress(50);
  
  // Direct S3 Upload (No temporary disk usage)
  const key = objectPathBuilder.generatedPaper(assignmentId, version || 1);
  await uploadBuffer(key, pdfBuffer, 'application/pdf', traceId);
  
  await job.updateProgress(100);
  return { success: true, key };
}, { connection: redis });
