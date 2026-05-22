import { ASSIGNMENT_EVENT_ACTIONS, ENTERPRISE_EVENT_ACTION_PREFIX, PLUGIN_EVENT_ACTION_PREFIX } from '../constants/assignment-event-actions.constants';
import { AssignmentEventAction } from '../types/assignment-event.types';

export function isSupportedAssignmentEventAction(action: string): action is AssignmentEventAction {
  return (ASSIGNMENT_EVENT_ACTIONS as readonly string[]).includes(action);
}

export function isExtensibleAssignmentEventAction(action: string): boolean {
  return action.startsWith(ENTERPRISE_EVENT_ACTION_PREFIX) || action.startsWith(PLUGIN_EVENT_ACTION_PREFIX);
}

export function assertSupportedAssignmentEventAction(action: string): asserts action is AssignmentEventAction {
  if (!isSupportedAssignmentEventAction(action)) {
    throw new Error(`Unsupported assignment event action: ${action}`);
  }
}
