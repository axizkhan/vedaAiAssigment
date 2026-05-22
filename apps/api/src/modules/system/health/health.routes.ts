import { Router } from 'express';
import { asyncHandler } from '../../../middleware/error.middleware';
import { getHealthController } from './health.controller';

export const healthRouter = Router();

healthRouter.get('/', asyncHandler(getHealthController));

export default healthRouter;
