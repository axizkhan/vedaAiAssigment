import { Router } from 'express';
import { authenticate } from '../../../middleware/auth.middleware';
import { adminGuard } from './admin.guard';
import { bullBoardRouter } from './admin.queue';

export const adminRouter = Router();

adminRouter.use('/queues', authenticate, adminGuard, bullBoardRouter);

export default adminRouter;
