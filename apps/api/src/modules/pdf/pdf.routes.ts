import { Router } from 'express';
import { PdfController } from './pdf.controller';

const router = Router();

router.get('/:assignmentId', PdfController.generateOrGetPdf);
router.get('/:assignmentId/status', PdfController.getPdfStatus);

export default router;
