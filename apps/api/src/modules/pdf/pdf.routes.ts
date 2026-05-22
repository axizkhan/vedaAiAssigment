import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../middleware/error.middleware';
import { generatePdfController, getPdfController } from './pdf.controller';

export const pdfRouter = Router();

pdfRouter.post('/:assignmentId/generate', authenticate, asyncHandler(generatePdfController));
pdfRouter.get('/:assignmentId', authenticate, asyncHandler(getPdfController));

export default pdfRouter;
