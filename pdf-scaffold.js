const fs = require('fs');
const path = require('path');

const files = {
  // PDF PACKAGE
  "packages/pdf/package.json": `
{
  "name": "@assessment-ai/pdf",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "puppeteer": "^22.0.0",
    "handlebars": "^4.7.8"
  },
  "devDependencies": {
    "@assessment-ai/tsconfig": "workspace:*",
    "@types/node": "^20.0.0",
    "typescript": "^5.4.3"
  }
}
  `,
  "packages/pdf/src/templates/exam-paper.hbs": `
<!DOCTYPE html>
<html>
<head>
  <style>
    @page { size: A4; margin: 20mm 25mm; }
    body { font-family: sans-serif; }
    .page-break { page-break-after: always; }
    .avoid-break { break-inside: avoid; }
  </style>
</head>
<body>
  <h1>{{title}}</h1>
  <h2>{{subject}}</h2>
  <div class="instructions">{{instructions}}</div>
</body>
</html>
  `,
  "packages/pdf/src/styles/print.css": `
@page {
  size: A4;
  margin: 20mm 25mm;
}
.avoid-break {
  break-inside: avoid;
}
  `,
  "packages/pdf/src/renderer/puppeteer.renderer.ts": `
import puppeteer from 'puppeteer';

export class PuppeteerRenderer {
  async renderHtmlToPdf(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true
    });
    await browser.close();
    return Buffer.from(pdfBuffer);
  }
}
  `,
  "packages/pdf/src/utils/pdf-metadata.ts": `export const metadata = {};`,
  "packages/pdf/src/utils/page-breaks.ts": `export const pageBreaks = {};`,
  "packages/pdf/src/utils/template-sanitizer.ts": `export const templateSanitizer = {};`,
  "packages/pdf/src/index.ts": `
export * from './renderer/puppeteer.renderer';
  `,

  // QUEUE PACKAGE UPDATES
  "packages/queue/src/queues/pdf.queue.ts": `
import { Queue } from 'bullmq';
import { redis } from '@assessment-ai/redis';

export const pdfQueue = new Queue('pdf', {
  connection: redis,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: 'fixed', delay: 3000 },
    removeOnComplete: true,
    removeOnFail: true
  }
});
  `,
  "packages/queue/src/workers/pdf.worker.ts": `
import { Worker } from 'bullmq';
import { redis } from '@assessment-ai/redis';
import { logger } from '@assessment-ai/logger';

export const pdfWorker = new Worker('pdf', async (job) => {
  logger.info('Processing PDF job ' + job.id);
  await job.updateProgress(100);
  return { success: true };
}, { connection: redis });
  `,
  "packages/queue/src/events/pdf.events.ts": `export const pdfEvents = {};`,

  // DATABASE PACKAGE
  "packages/database/src/services/paper-pdf.service.ts": `
export const paperPdfService = {
  checkIfExists: async (assignmentId: string, version: number) => false,
  updatePdfUrl: async (assignmentId: string, version: number, url: string) => true
};
  `,

  // API MODULE
  "apps/api/src/modules/pdf/pdf.controller.ts": `
import { Request, Response } from 'express';
import { pdfService } from './pdf.service';
import { sendSuccessResponse } from '../../common/response';

export const generatePdfController = async (req: Request, res: Response) => {
  const result = await pdfService.generatePdf({
    assignmentId: req.params.assignmentId,
    userId: req.user!.id,
    traceId: req.traceId
  });
  return sendSuccessResponse(res, { statusCode: 202, data: result });
};

export const getPdfController = async (req: Request, res: Response) => {
  const result = await pdfService.getPdf(req.params.assignmentId, req.user!.id, req.query.version as string);
  return res.redirect(302, result.url);
};
  `,
  "apps/api/src/modules/pdf/pdf.service.ts": `
import { pdfQueue } from '@assessment-ai/queue';

export const pdfService = {
  generatePdf: async (input: any) => {
    const job = await pdfQueue.add('generate-pdf', input);
    return { jobId: job.id };
  },
  getPdf: async (assignmentId: string, userId: string, version?: string) => {
    return { url: 'https://s3.example.com/pdfs/' + assignmentId + '/v' + (version || 1) + '.pdf' };
  }
};
  `,
  "apps/api/src/modules/pdf/pdf.routes.ts": `
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../middleware/error.middleware';
import { generatePdfController, getPdfController } from './pdf.controller';

export const pdfRouter = Router();

pdfRouter.post('/:assignmentId/generate', authMiddleware, asyncHandler(generatePdfController));
pdfRouter.get('/:assignmentId', authMiddleware, asyncHandler(getPdfController));

export default pdfRouter;
  `,
  "apps/api/src/modules/pdf/pdf.schemas.ts": `export const schemas = {};`,
  "apps/api/src/modules/pdf/pdf.validators.ts": `export const validators = {};`,
  "apps/api/src/modules/pdf/pdf.constants.ts": `export const constants = {};`,
  "apps/api/src/modules/pdf/pdf.types.ts": `export const types = {};`,
  "apps/api/src/modules/pdf/pdf.mapper.ts": `export const mapper = {};`,
  "apps/api/src/modules/pdf/pdf.queue.ts": `export const queue = {};`,
  "apps/api/src/modules/pdf/pdf.template.ts": `export const template = {};`,
  "apps/api/src/modules/pdf/pdf.styles.ts": `export const styles = {};`,
  "apps/api/src/modules/pdf/pdf.renderer.ts": `export const renderer = {};`,
  "apps/api/src/modules/pdf/pdf.storage.ts": `export const storage = {};`,
  "apps/api/src/modules/pdf/pdf.websocket.ts": `export const websocket = {};`,
  "apps/api/src/modules/pdf/pdf.audit.ts": `export const audit = {};`,
  "apps/api/src/modules/pdf/pdf.errors.ts": `export const errors = {};`,
  "apps/api/src/modules/pdf/pdf.utils.ts": `export const utils = {};`,
  "apps/api/src/modules/pdf/pdf.security.ts": `export const security = {};`,
  "apps/api/src/modules/pdf/index.ts": `export * from './pdf.routes';`
};

for (const [filePath, content] of Object.entries(files)) {
  const absolutePath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content.trim() + '\n');
  console.log('Created ' + filePath);
}
