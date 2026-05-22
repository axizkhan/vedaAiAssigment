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
