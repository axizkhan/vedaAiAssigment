export const canAccessAssignment = (assignment: any, userId: string): boolean => {
  if (!assignment || !assignment.createdBy) {
    return false;
  }
  
  // Exact match rule
  return assignment.createdBy.toString() === userId;
};
