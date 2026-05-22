import { AssignmentEventAction } from '../types/assignment-event.types';

export const ASSIGNMENT_EVENT_ACTIONS = [
  AssignmentEventAction.CREATED,
  AssignmentEventAction.UPDATED,
  AssignmentEventAction.UPLOADED_FILE,
  AssignmentEventAction.TRIGGERED_GENERATION,
  AssignmentEventAction.REGENERATED_SECTION,
  AssignmentEventAction.DOWNLOADED_PDF,
  AssignmentEventAction.FAILED_GENERATION,
] as const;

export const ENTERPRISE_EVENT_ACTION_PREFIX = 'enterprise.';
export const PLUGIN_EVENT_ACTION_PREFIX = 'plugin.';
