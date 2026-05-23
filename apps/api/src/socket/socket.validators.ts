import { SocketValidationError } from './socket.errors';

// Strict validation to prevent NoSQL injection or payload abuse
export const validateAssignmentJoinPayload = (payload: any): void => {
  if (!payload || typeof payload !== 'object') {
    throw new SocketValidationError('Invalid payload format');
  }

  const { assignmentId } = payload;

  if (!assignmentId || typeof assignmentId !== 'string') {
    throw new SocketValidationError('assignmentId is required and must be a string');
  }

  // Very basic check for MongoDB ObjectId format (24 hex characters)
  if (!/^[0-9a-fA-F]{24}$/.test(assignmentId)) {
    throw new SocketValidationError('Invalid assignmentId format');
  }
};

export const validateAssignmentLeavePayload = validateAssignmentJoinPayload;

export const validateSocketSession = (socketData: any): void => {
  if (!socketData || !socketData.userId) {
    throw new SocketValidationError('Unauthenticated socket session');
  }
};
