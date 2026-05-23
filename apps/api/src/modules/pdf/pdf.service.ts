import { enqueuePdfGeneration } from './pdf.queue';
import { PdfStorage } from './pdf.storage';
import { PdfNotFoundError } from './pdf.errors';
import { PdfWebsocket } from './pdf.websocket';
import { mapVersionToPdfMeta } from './pdf.mapper';

// Stub for Version Model
const VersionModel = {
  findOne: async ({ assignmentId, version }: any) => {
    return {
      assignmentId,
      version,
      pdfS3Key: null, // Change to test redirect
    };
  }
};

export const PdfService = {
  getPdfStatus: async (assignmentId: string, version: number) => {
    const versionDoc = await VersionModel.findOne({ assignmentId, version });
    if (!versionDoc) throw new PdfNotFoundError('Version not found');

    if (versionDoc.pdfS3Key) {
      return { status: 'completed', exists: true };
    }
    return { status: 'queued', exists: false };
  },

  getOrGeneratePdf: async (
    assignmentId: string, 
    version: number, 
    userId: string, 
    traceId: string
  ): Promise<{ redirectUrl?: string, queued?: boolean, jobId?: string }> => {
    const versionDoc = await VersionModel.findOne({ assignmentId, version });
    if (!versionDoc) throw new PdfNotFoundError('Version not found');

    const meta = mapVersionToPdfMeta(versionDoc);

    if (meta.pdfS3Key) {
      const signedUrl = await PdfStorage.getSignedPdfUrl(meta.pdfS3Key);
      return { redirectUrl: signedUrl };
    }

    const jobId = await enqueuePdfGeneration({
      assignmentId,
      version,
      requestedBy: userId,
      traceId,
      requestedAt: new Date().toISOString(),
    });

    PdfWebsocket.emitPdfQueued(assignmentId, version);

    return { queued: true, jobId };
  }
};
