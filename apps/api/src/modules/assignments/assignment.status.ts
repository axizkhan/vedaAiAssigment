import { AssignmentStatus as DatabaseAssignmentStatus } from '@assessment-ai/database';

export const AssignmentStatus = DatabaseAssignmentStatus;

export const ASSIGNMENT_STATUS_VALUES = Object.values(DatabaseAssignmentStatus);

export function canUserEditAssignment(status: DatabaseAssignmentStatus): boolean {
  return [DatabaseAssignmentStatus.DRAFT, DatabaseAssignmentStatus.FAILED].includes(status);
}
