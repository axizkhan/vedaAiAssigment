const fs = require('fs');
const path = require('path');

const files = {
  // AI PACKAGE
  "packages/ai/src/providers/base.provider.ts": `
export interface RawAIResponse {
  content: string;
  model: string;
  provider: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
  durationMs: number;
}
export interface AIProvider {
  generatePaper(input: any): Promise<RawAIResponse>;
}
  `,
  "packages/ai/src/providers/groq.provider.ts": `
import { AIProvider, RawAIResponse } from './base.provider';
import { logger } from '@assessment-ai/logger';

export class GroqProvider implements AIProvider {
  async generatePaper(input: any): Promise<RawAIResponse> {
    logger.info('Calling Groq API');
    return {
      content: JSON.stringify({ sections: [] }),
      model: 'llama3-70b',
      provider: 'groq',
      usage: { inputTokens: 100, outputTokens: 200 },
      durationMs: 1500
    };
  }
}
  `,
  "packages/ai/src/providers/openrouter.provider.ts": `
import { AIProvider, RawAIResponse } from './base.provider';
import { logger } from '@assessment-ai/logger';

export class OpenRouterProvider implements AIProvider {
  async generatePaper(input: any): Promise<RawAIResponse> {
    logger.info('Calling OpenRouter API');
    return {
      content: JSON.stringify({ sections: [] }),
      model: 'anthropic/claude-3',
      provider: 'openrouter',
      usage: { inputTokens: 150, outputTokens: 250 },
      durationMs: 2000
    };
  }
}
  `,
  "packages/ai/src/router/orchestrator.ts": `
import { GroqProvider } from '../providers/groq.provider';
import { OpenRouterProvider } from '../providers/openrouter.provider';
import { logger } from '@assessment-ai/logger';

export class AIOrchestrator {
  private groq = new GroqProvider();
  private openrouter = new OpenRouterProvider();

  async generate(input: any) {
    try {
      return await this.groq.generatePaper(input);
    } catch (e) {
      logger.warn('Groq failed, failing over to OpenRouter');
      return await this.openrouter.generatePaper(input);
    }
  }
}
  `,
  "packages/ai/src/prompts/index.ts": `
export const generatePrompt = (context: string) => {
  return \`Strict JSON only. \${context}\`;
};
  `,
  "packages/ai/src/parser/index.ts": `
export const parseAIResponse = (response: any) => {
  return { valid: true, data: response };
};
  `,
  "packages/ai/src/engine/index.ts": `export const engine = {};`,
  "packages/ai/src/orchestration/index.ts": `export const orchestration = {};`,
  "packages/ai/src/validators/index.ts": `export const validators = {};`,

  // QUEUE PACKAGE
  "packages/queue/src/queues/generation.queue.ts": `
import { Queue } from 'bullmq';
import { redis } from '@assessment-ai/redis';

export const generationQueue = new Queue('generation', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: true,
    removeOnFail: true
  }
});
  `,
  "packages/queue/src/queues/dead-letter.queue.ts": `
import { Queue } from 'bullmq';
import { redis } from '@assessment-ai/redis';

export const deadLetterQueue = new Queue('dead-letter', { connection: redis });
  `,
  "packages/queue/src/workers/generation.worker.ts": `
import { Worker } from 'bullmq';
import { redis } from '@assessment-ai/redis';
import { logger } from '@assessment-ai/logger';
import { AssignmentGenerationService } from '@assessment-ai/database';

export const generationWorker = new Worker('generation', async (job) => {
  logger.info(\`Processing generation job \${job.id}\`);
  await job.updateProgress(10);
  await new Promise(r => setTimeout(r, 1000));
  await job.updateProgress(100);
  return { success: true };
}, { connection: redis });
  `,
  "packages/queue/src/workers/dead-letter.worker.ts": `
import { Worker } from 'bullmq';
import { redis } from '@assessment-ai/redis';
import { logger } from '@assessment-ai/logger';

export const deadLetterWorker = new Worker('dead-letter', async (job) => {
  logger.warn(\`Processing dead letter job \${job.id}\`);
}, { connection: redis });
  `,
  "packages/queue/src/events/generation.events.ts": `export const events = {};`,
  "packages/queue/src/utils/queue-position.ts": `export const getQueuePosition = async () => 1;`,
  "packages/queue/src/utils/retry-policy.ts": `export const retryPolicy = {};`,
  "packages/queue/src/index.ts": `
export * from './queues/generation.queue';
export * from './queues/dead-letter.queue';
export * from './workers/generation.worker';
export * from './workers/dead-letter.worker';
  `,

  // API PACKAGE
  "apps/api/src/modules/generation/generation.controller.ts": `
import { Request, Response } from 'express';
import { generationService } from './generation.service';
import { sendSuccessResponse } from '../../common/response';

export const triggerGenerationController = async (req: Request, res: Response) => {
  const result = await generationService.triggerGeneration({
    assignmentId: req.params.assignmentId,
    userId: req.user!.id,
    traceId: req.traceId
  });
  return sendSuccessResponse(res, { statusCode: 202, data: result });
};

export const getStatusController = async (req: Request, res: Response) => {
  const result = await generationService.getGenerationStatus(req.params.assignmentId, req.user!.id);
  return sendSuccessResponse(res, { data: result });
};

export const regenerateSectionController = async (req: Request, res: Response) => {
  const result = await generationService.regenerateSection(req.params.assignmentId, req.body, req.user!.id);
  return sendSuccessResponse(res, { data: result });
};

export const getResultController = async (req: Request, res: Response) => {
  const result = await generationService.getGeneratedResult(req.params.assignmentId, req.user!.id);
  return sendSuccessResponse(res, { data: result });
};
  `,
  "apps/api/src/modules/generation/generation.service.ts": `
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
  `,
  "apps/api/src/modules/generation/generation.routes.ts": `
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../middleware/error.middleware';
import { triggerGenerationController, getStatusController, regenerateSectionController, getResultController } from './generation.controller';

export const generationRouter = Router();

generationRouter.post('/:assignmentId', authMiddleware, asyncHandler(triggerGenerationController));
generationRouter.get('/:assignmentId/status', authMiddleware, asyncHandler(getStatusController));
generationRouter.post('/:assignmentId/regenerate-section', authMiddleware, asyncHandler(regenerateSectionController));
generationRouter.get('/result/:assignmentId', authMiddleware, asyncHandler(getResultController));

export default generationRouter;
  `,
  "apps/api/src/modules/generation/generation.schemas.ts": `export const schemas = {};`,
  "apps/api/src/modules/generation/generation.validators.ts": `export const validators = {};`,
  "apps/api/src/modules/generation/generation.constants.ts": `export const constants = {};`,
  "apps/api/src/modules/generation/generation.types.ts": `export const types = {};`,
  "apps/api/src/modules/generation/generation.mapper.ts": `export const mapper = {};`,
  "apps/api/src/modules/generation/generation.progress.ts": `export const progress = {};`,
  "apps/api/src/modules/generation/generation.queue.ts": `export const queue = {};`,
  "apps/api/src/modules/generation/generation.idempotency.ts": `export const idempotency = {};`,
  "apps/api/src/modules/generation/generation.permissions.ts": `export const permissions = {};`,
  "apps/api/src/modules/generation/generation.audit.ts": `export const audit = {};`,
  "apps/api/src/modules/generation/generation.status.ts": `export const status = {};`,
  "apps/api/src/modules/generation/generation.retry.ts": `export const retry = {};`,
  "apps/api/src/modules/generation/generation.websocket.ts": `export const websocket = {};`,
  "apps/api/src/modules/generation/generation.utils.ts": `export const utils = {};`,
  "apps/api/src/modules/generation/generation.errors.ts": `export const errors = {};`,
  "apps/api/src/modules/generation/index.ts": `export * from './generation.routes';`
};

for (const [filePath, content] of Object.entries(files)) {
  const absolutePath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content.trim() + '\n');
  console.log('Created ' + filePath);
}
