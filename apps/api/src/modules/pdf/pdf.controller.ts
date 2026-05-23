import { Request, Response } from 'express';
import { validatePdfRequest } from './pdf.validators';
import { validatePdfAccess } from './pdf.security';
import { PdfService } from './pdf.service';
import { PdfAudit } from './pdf.audit';
import { v4 as uuidv4 } from 'uuid';

export const PdfController = {
  generateOrGetPdf: async (req: Request, res: Response) => {
    try {
      const { assignmentId } = req.params;
      const version = parseInt(req.query.version as string, 10);
      
      validatePdfRequest({ assignmentId, version });
      // validatePdfAccess(req.user, assignmentId);
      
      const traceId = uuidv4();

      const result = await PdfService.getOrGeneratePdf(assignmentId, version, 'user-id-stub', traceId);

      if (result.redirectUrl) {
        PdfAudit.logEvent('pdf_downloaded', { traceId, assignmentId, version });
        return res.redirect(302, result.redirectUrl);
      }

      PdfAudit.logEvent('pdf_queued', { traceId, assignmentId, version, jobId: result.jobId });
      return res.status(202).json({
        success: true,
        data: {
          queued: true,
          jobId: result.jobId,
          status: 'processing'
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  getPdfStatus: async (req: Request, res: Response) => {
    try {
      const { assignmentId } = req.params;
      const version = parseInt(req.query.version as string, 10);
      
      validatePdfRequest({ assignmentId, version });
      
      const status = await PdfService.getPdfStatus(assignmentId, version);
      return res.json({ success: true, data: status });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};
