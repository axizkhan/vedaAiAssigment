import { SocketPermissionError } from './socket.errors';
import { canAccessAssignment } from './socket.permissions';
import { validateSocketSession } from './socket.validators';

// Stub for Database layer
const AssignmentRepo = {
  findById: async (id: string) => {
    // Return a mock assignment for testing snapshots
    return { 
      _id: id, 
      createdBy: 'mockUserId', // This should match the JWT stub we used if testing
      status: 'QUEUED' // Mock state for sync
    };
  }
};

export const assertAuthenticatedSocket = (socketData: any) => {
  validateSocketSession(socketData);
};

export const assertAuthorizedAssignmentAccess = async (assignmentId: string, userId: string) => {
  try {
    const assignment = await AssignmentRepo.findById(assignmentId);
    
    // We intentionally throw the EXACT SAME ERROR if it doesn't exist OR if unauthorized
    // This prevents malicious clients from guessing valid ObjectIds
    if (!assignment || !canAccessAssignment(assignment, userId)) {
      throw new SocketPermissionError('Access denied to this assignment');
    }

    return assignment; // Return for snapshot sync
  } catch (error) {
    // Catch DB errors and mask them as FORBIDDEN
    throw new SocketPermissionError('Access denied to this assignment');
  }
};
