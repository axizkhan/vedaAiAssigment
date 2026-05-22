import { Router } from 'express';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { adminGuard } from './admin.guard';
import { bullBoardRouter } from './admin.queue';

export const adminRouter = Router();

adminRouter.use('/queues', authMiddleware, adminGuard, bullBoardRouter);

export default adminRouter;
