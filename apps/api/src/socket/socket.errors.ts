export class SocketError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'SocketError';
  }
}

export class SocketAuthError extends SocketError {
  constructor(message: string) {
    super(message, 'UNAUTHORIZED');
  }
}

export class SocketPermissionError extends SocketError {
  constructor(message: string) {
    // We intentionally mask permissions and existence behind FORBIDDEN 
    // to prevent room enumeration attacks.
    super(message, 'FORBIDDEN');
  }
}

export class SocketRoomError extends SocketError {
  constructor(message: string) {
    super(message, 'FORBIDDEN');
  }
}

export class SocketValidationError extends SocketError {
  constructor(message: string) {
    super(message, 'BAD_REQUEST');
  }
}
