import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../middleware/error.middleware';
import { triggerGenerationController, getStatusController, regenerateSectionController, getResultController } from './generation.controller';

export const generationRouter = Router();

generationRouter.post('/:assignmentId', authenticate, asyncHandler(triggerGenerationController));
generationRouter.get('/:assignmentId/status', authenticate, asyncHandler(getStatusController));
generationRouter.post('/:assignmentId/regenerate-section', authenticate, asyncHandler(regenerateSectionController));
generationRouter.get('/result/:assignmentId', authenticate, asyncHandler(getResultController));

export default generationRouter;
