import { AssignmentStatus } from '../types/assignment.types';
import { VALID_STATUS_TRANSITIONS } from '../constants/assignment-status.constants';

export const isValidTransition = (current: AssignmentStatus, next: AssignmentStatus): boolean => {
  return VALID_STATUS_TRANSITIONS[current]?.includes(next) ?? false;
};
