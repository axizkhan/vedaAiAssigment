import { logger } from '@assessment-ai/logger';

export const promptMetrics = {
  trackBuild: (data: {
    traceId?: string;
    promptVersion: string;
    assignmentId?: string;
    inputTokensEstimated: number;
    extractedCharsUsed: number;
    truncated: boolean;
    questionCount: number;
    totalMarks: number;
    durationMs: number;
  }) => {
    logger.info('Prompt successfully built', { event: 'prompt_build_success', ...data });
  },
  trackFailure: (error: Error, traceId?: string) => {
    logger.error('Prompt build failed', { event: 'prompt_build_failure', error: error.message, traceId });
  }
};
