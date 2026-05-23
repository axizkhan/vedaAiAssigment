export interface PdfMetadata {
  generatedAt: string;
  generationDurationMs: number;
  pageCount: number;
  fileSizeBytes: number;
  rendererVersion: string;
}

export const generatePdfMetadata = (durationMs: number, buffer: Buffer): PdfMetadata => {
  return {
    generatedAt: new Date().toISOString(),
    generationDurationMs: durationMs,
    pageCount: 0, // In a real implementation, parse PDF buffer for page count
    fileSizeBytes: buffer.length,
    rendererVersion: '1.0.0'
  };
};
