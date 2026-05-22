import { Request, Response } from 'express';
import { pdfService } from './pdf.service';
import { sendSuccessResponse } from '../../common/response';

export const generatePdfController = async (req: Request, res: Response) => {
  const result = await pdfService.generatePdf({
    assignmentId: req.params.assignmentId,
    userId: req.user!.id,
    traceId: req.traceId
  });
  return sendSuccessResponse(res, { statusCode: 202, data: result });
};

export const getPdfController = async (req: Request, res: Response) => {
  const result = await pdfService.getPdf(req.params.assignmentId, req.user!.id, req.query.version as string);
  return res.redirect(302, result.url);
};
