import { generationQueue } from '@assessment-ai/queue';

export const generationService = {
  triggerGeneration: async (input: any) => {
    const job = await generationQueue.add('generate', input);
    return { jobId: job.id, message: 'Generation queued', queuePosition: 1 };
  },
  getGenerationStatus: async (assignmentId: string, userId: string) => {
    return { status: 'generating', progress: { step: 3, percent: 60, message: 'Generating' }, jobId: '123', queuePosition: 0 };
  },
  regenerateSection: async (assignmentId: string, input: any, userId: string) => {
    return { jobId: '456', version: 2 };
  },
  getGeneratedResult: async (assignmentId: string, userId: string) => {
    return { paper: {}, version: 1, totalVersions: 1 };
  }
};
