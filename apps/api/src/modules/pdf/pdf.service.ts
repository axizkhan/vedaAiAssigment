import { pdfQueue } from '@assessment-ai/queue';
import { getSignedUrl, objectPathBuilder } from '@assessment-ai/object-storage';

export const pdfService = {
  generatePdf: async (input: any) => {
    const job = await pdfQueue.add('generate-pdf', input);
    return { jobId: job.id };
  },
  getPdf: async (assignmentId: string, userId: string, version?: string) => {
    const key = objectPathBuilder.generatedPaper(assignmentId, parseInt(version || '1', 10));
    const url = await getSignedUrl(key, 3600); // 1 hour expiry
    return { url };
  }
};
