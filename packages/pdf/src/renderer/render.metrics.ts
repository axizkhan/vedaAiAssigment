export const RenderMetrics = {
  recordDuration: (metric: string, durationMs: number) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Metrics] ${metric}: ${durationMs}ms`);
    }
  },
  recordPdfSize: (sizeBytes: number) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Metrics] pdf_size_bytes: ${sizeBytes}`);
    }
  },
  recordFailure: (errorType: string) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Metrics] render_failure_rate incremented for ${errorType}`);
    }
  }
};
