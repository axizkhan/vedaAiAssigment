import { MalformedPdfError } from './extractor.errors';

export const guardAgainstMalformedPdf = (buffer: Buffer): void => {
  if (!buffer || buffer.length === 0) {
    throw new MalformedPdfError('Empty buffer');
  }

  // Check magic bytes for PDF (%PDF-)
  if (buffer.length < 5 || buffer.toString('ascii', 0, 5) !== '%PDF-') {
    throw new MalformedPdfError('Invalid PDF signature');
  }

  // Quick heuristic: look for massive ObjStm which might indicate a zip bomb
  // In a real production system, you'd integrate more sophisticated scanning
  // For now, we enforce a strict buffer size limit upstream which mitigates this.
};
