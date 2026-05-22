import { Assignment } from '../modules/assignments/assignment.model';
import { AuthenticatedSocket } from './socket.types';

export const socketGuard = {
  requireRole: (socket: AuthenticatedSocket, role: string): boolean => {
    return socket.data.user?.role === role;
  },
  
  requireAssignmentAccess: async (socket: AuthenticatedSocket, assignmentId: string): boolean => {
    if (socket.data.user?.role === 'admin') return true;
    
    const assignment = await Assignment.findById(assignmentId).select('createdBy');
    if (!assignment) return false;
    
    return assignment.createdBy.toString() === socket.data.user.id;
  }
};
