import { PDF_CONSTANTS } from './pdf.constants';
import { PdfJobPayload } from './pdf.types';

// Stub for BullMQ Queue
export const enqueuePdfGeneration = async (payload: PdfJobPayload) => {
  // await pdfQueue.add('generate', payload, {
  //   attempts: PDF_CONSTANTS.JOB_ATTEMPTS,
  //   backoff: {
  //     type: 'fixed',
  //     delay: PDF_CONSTANTS.JOB_BACKOFF_DELAY
  //   }
  // });
  return \`job-\${Date.now()}\`;
};
