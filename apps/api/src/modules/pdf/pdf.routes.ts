import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../middleware/error.middleware';
import { generatePdfController, getPdfController } from './pdf.controller';

export const pdfRouter = Router();

pdfRouter.post('/:assignmentId/generate', authMiddleware, asyncHandler(generatePdfController));
pdfRouter.get('/:assignmentId', authMiddleware, asyncHandler(getPdfController));

export default pdfRouter;
