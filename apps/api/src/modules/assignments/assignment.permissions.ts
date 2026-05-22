import { IAssignment } from '@assessment-ai/database';

export function isAssignmentOwner(assignment: IAssignment, userId: string): boolean {
  return assignment.createdBy.toString() === userId;
}
