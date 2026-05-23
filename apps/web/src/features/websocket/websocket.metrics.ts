// OpenTelemetry/Prometheus/Grafana ready metrics interface
export const WebsocketMetrics = {
  logEvent: (
    eventName: string,
    payload: {
      assignmentId?: string;
      traceId?: string;
      reconnectCount?: number;
      socketState?: string;
      event?: string;
      timestamp: number;
      [key: string]: any;
    }
  ) => {
    // In production, this would bridge to an OpenTelemetry logger or similar observability tool.
    // Ensure no sensitive info is leaked here.
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[WS_METRIC] ${eventName}`, payload);
    }
  },

  trackConnection: (state: string, details?: any) => {
    WebsocketMetrics.logEvent('socket_connection_state', {
      socketState: state,
      timestamp: Date.now(),
      ...details,
    });
  },

  trackReconnectAttempt: (count: number) => {
    WebsocketMetrics.logEvent('reconnect_attempted', {
      reconnectCount: count,
      timestamp: Date.now(),
    });
  },

  trackSubscriptionRestore: (assignmentId: string) => {
    WebsocketMetrics.logEvent('subscription_restored', {
      assignmentId,
      timestamp: Date.now(),
    });
  },

  trackPollingStarted: (assignmentId: string) => {
    WebsocketMetrics.logEvent('polling_started', {
      assignmentId,
      timestamp: Date.now(),
    });
  },

  trackPollingStopped: (assignmentId: string) => {
    WebsocketMetrics.logEvent('polling_stopped', {
      assignmentId,
      timestamp: Date.now(),
    });
  },

  trackSyncRecovered: (assignmentId: string, traceId?: string) => {
    WebsocketMetrics.logEvent('sync_recovered', {
      assignmentId,
      traceId,
      timestamp: Date.now(),
    });
  }
};
