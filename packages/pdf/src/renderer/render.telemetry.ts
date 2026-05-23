export const RenderTelemetry = {
  logEvent: (event: string, payload: Record<string, any>) => {
    // OpenTelemetry / structured logger bridge
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Telemetry] ${event}`, payload);
    }
  }
};
