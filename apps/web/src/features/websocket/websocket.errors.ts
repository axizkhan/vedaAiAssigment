export class WebSocketAuthError extends Error {
  constructor(message: string = 'WebSocket authentication failed') {
    super(message);
    this.name = 'WebSocketAuthError';
  }
}

export class WebSocketReconnectError extends Error {
  constructor(message: string = 'WebSocket failed to reconnect') {
    super(message);
    this.name = 'WebSocketReconnectError';
  }
}

export class WebSocketSubscriptionError extends Error {
  constructor(message: string = 'Failed to subscribe to realtime events') {
    super(message);
    this.name = 'WebSocketSubscriptionError';
  }
}

export class WebSocketSyncError extends Error {
  constructor(message: string = 'Failed to synchronize realtime state') {
    super(message);
    this.name = 'WebSocketSyncError';
  }
}
