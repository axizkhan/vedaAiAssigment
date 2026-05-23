export const PdfTelemetry = {
  logEvent: (event: string, payload: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Telemetry] ${event}`, payload);
    }
  }
};
