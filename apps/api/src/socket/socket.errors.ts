export enum SocketErrorCode {
  SOCKET_UNAUTHORIZED = 'SOCKET_UNAUTHORIZED',
  SOCKET_TOKEN_EXPIRED = 'SOCKET_TOKEN_EXPIRED',
  SOCKET_INVALID_TOKEN = 'SOCKET_INVALID_TOKEN',
  SOCKET_SESSION_REVOKED = 'SOCKET_SESSION_REVOKED',
  SOCKET_FORBIDDEN = 'SOCKET_FORBIDDEN'
}

export class SocketError extends Error {
  public code: SocketErrorCode;

  constructor(code: SocketErrorCode) {
    super(code);
    this.name = 'SocketError';
    this.code = code;
  }
}
