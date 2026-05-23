export const PdfMetrics = {
  recordRenderDuration: (durationMs: number) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Metrics] PDF render duration: ${durationMs}ms`);
    }
  },
  recordPdfUpload: (sizeBytes: number) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Metrics] PDF uploaded size: ${sizeBytes} bytes`);
    }
  }
};
