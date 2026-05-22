import { AssignmentStatus } from '../types/assignment.types';

export const VALID_STATUS_TRANSITIONS: Record<AssignmentStatus, AssignmentStatus[]> = {
  [AssignmentStatus.DRAFT]: [AssignmentStatus.QUEUED],
  [AssignmentStatus.QUEUED]: [AssignmentStatus.GENERATING, AssignmentStatus.DRAFT],
  [AssignmentStatus.GENERATING]: [AssignmentStatus.COMPLETED, AssignmentStatus.FAILED],
  [AssignmentStatus.COMPLETED]: [], // Terminal state
  [AssignmentStatus.FAILED]: [AssignmentStatus.QUEUED],
};
