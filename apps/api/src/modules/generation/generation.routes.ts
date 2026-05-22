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
