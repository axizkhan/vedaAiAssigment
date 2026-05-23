import { PdfReadyPayload } from './pdf.types';

export const PdfWebsocket = {
  emitPdfReady: (payload: PdfReadyPayload) => {
    // Bridges to Socket.io infrastructure
    // io.to(\`assignment:\${payload.assignmentId}\`).emit('pdf:ready', payload);
  },
  emitPdfFailed: (assignmentId: string, version: number, message: string) => {
    // io.to(\`assignment:\${assignmentId}\`).emit('pdf:failed', { assignmentId, version, message });
  },
  emitPdfQueued: (assignmentId: string, version: number) => {
    // io.to(\`assignment:\${assignmentId}\`).emit('pdf:queued', { assignmentId, version });
  }
};
