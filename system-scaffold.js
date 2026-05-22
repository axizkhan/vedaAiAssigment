const fs = require('fs');
const path = require('path');

const files = {
  // HEALTH MODULE
  "apps/api/src/modules/system/health/health.controller.ts": `
import { Request, Response } from 'express';
import { healthService } from './health.service';
import { sendSuccessResponse } from '../../../common/response';

export const getHealthController = async (req: Request, res: Response) => {
  const result = await healthService.getSystemHealth();
  const statusCode = result.status === 'unhealthy' ? 503 : 200;
  return sendSuccessResponse(res, { statusCode, data: result });
};
  `,
  "apps/api/src/modules/system/health/health.service.ts": `
import { healthChecks } from './health.checks';
import { logger } from '@assessment-ai/logger';

export const healthService = {
  getSystemHealth: async () => {
    const checks = await healthChecks.runAll();
    const isUnhealthy = Object.values(checks).some(c => c === 'unhealthy');
    const isDegraded = Object.values(checks).some(c => c === 'degraded');
    
    const status = isUnhealthy ? 'unhealthy' : isDegraded ? 'degraded' : 'ok';
    
    if (status !== 'ok') {
      logger.warn('System health is ' + status);
    }
    
    return {
      status,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      services: checks
    };
  }
};
  `,
  "apps/api/src/modules/system/health/health.checks.ts": `
export const healthChecks = {
  runAll: async () => {
    return {
      database: 'healthy',
      redis: 'healthy',
      storage: 'healthy',
      queue: 'healthy'
    };
  }
};
  `,
  "apps/api/src/modules/system/health/health.routes.ts": `
import { Router } from 'express';
import { asyncHandler } from '../../../middleware/error.middleware';
import { getHealthController } from './health.controller';

export const healthRouter = Router();

healthRouter.get('/', asyncHandler(getHealthController));

export default healthRouter;
  `,
  "apps/api/src/modules/system/health/health.types.ts": `export const types = {};`,
  "apps/api/src/modules/system/health/health.constants.ts": `export const constants = {};`,
  "apps/api/src/modules/system/health/health.utils.ts": `export const utils = {};`,
  "apps/api/src/modules/system/health/health.mapper.ts": `export const mapper = {};`,
  "apps/api/src/modules/system/health/health.metrics.ts": `export const metrics = {};`,
  "apps/api/src/modules/system/health/health.audit.ts": `export const audit = {};`,
  "apps/api/src/modules/system/health/index.ts": `export * from './health.routes';`,

  // ADMIN MODULE
  "apps/api/src/modules/system/admin/admin.queue.ts": `
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { generationQueue, deadLetterQueue, pdfQueue } from '@assessment-ai/queue';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/api/v1/admin/queues');

createBullBoard({
  queues: [
    new BullMQAdapter(generationQueue),
    new BullMQAdapter(pdfQueue),
    new BullMQAdapter(deadLetterQueue)
  ],
  serverAdapter: serverAdapter
});

export const bullBoardRouter = serverAdapter.getRouter();
  `,
  "apps/api/src/modules/system/admin/admin.guard.ts": `
import { Request, Response, NextFunction } from 'express';

export const adminGuard = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'You do not have permission' } });
  }
  next();
};
  `,
  "apps/api/src/modules/system/admin/admin.routes.ts": `
import { Router } from 'express';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { adminGuard } from './admin.guard';
import { bullBoardRouter } from './admin.queue';

export const adminRouter = Router();

// In production, this would be guarded by authMiddleware and adminGuard
// For the scaffolding, we simply mount the bull board router.
adminRouter.use('/queues', authMiddleware, adminGuard, bullBoardRouter);

export default adminRouter;
  `,
  "apps/api/src/modules/system/admin/admin.audit.ts": `export const audit = {};`,
  "apps/api/src/modules/system/admin/admin.constants.ts": `export const constants = {};`,
  "apps/api/src/modules/system/admin/index.ts": `export * from './admin.routes';`
};

for (const [filePath, content] of Object.entries(files)) {
  const absolutePath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content.trim() + '\\n');
  console.log('Created ' + filePath);
}
