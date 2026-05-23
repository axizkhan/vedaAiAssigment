export interface RealtimeConnectionState {
  isConnected: boolean;
  isReconnecting: boolean;
  reconnectAttempts: number;
  lastEventAt: number | null;
  lastSyncAt: number | null;
}

export interface RealtimeSubscriptionState {
  activeRooms: Set<string>;
  pendingRooms: Set<string>;
}

export interface EventTrace {
  traceId: string;
  timestamp: number;
}
