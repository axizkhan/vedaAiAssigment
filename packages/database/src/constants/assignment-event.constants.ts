import { ASSIGNMENT_EVENT_COLLECTION_NAME as LEGACY_ASSIGNMENT_EVENT_COLLECTION_NAME } from './assignment.constants';
import { AssignmentEventAction, AssignmentEventCategory, AssignmentEventSeverity } from '../types/assignment-event.types';

export const ASSIGNMENT_EVENT_COLLECTION_NAME = LEGACY_ASSIGNMENT_EVENT_COLLECTION_NAME;
export const MAX_METADATA_SIZE = 16 * 1024;
export const MAX_TIMELINE_PAGE_SIZE = 100;
export const EVENT_RETENTION_DAYS = 365;
export const TIMELINE_SESSION_WINDOW_MINUTES = 30;

export const SENSITIVE_METADATA_KEYS = [
  'password',
  'passwordHash',
  'refreshToken',
  'refreshTokens',
  'token',
  'jwt',
  'authorization',
  'apiKey',
  'secret',
  'rawPrompt',
  'prompt',
  'rawAiResponse',
  'extractedText',
  'rawExtractedText',
] as const;

export const EVENT_SEVERITY_BY_ACTION: Record<AssignmentEventAction, AssignmentEventSeverity> = {
  [AssignmentEventAction.CREATED]: AssignmentEventSeverity.INFO,
  [AssignmentEventAction.UPDATED]: AssignmentEventSeverity.INFO,
  [AssignmentEventAction.UPLOADED_FILE]: AssignmentEventSeverity.INFO,
  [AssignmentEventAction.TRIGGERED_GENERATION]: AssignmentEventSeverity.INFO,
  [AssignmentEventAction.REGENERATED_SECTION]: AssignmentEventSeverity.INFO,
  [AssignmentEventAction.DOWNLOADED_PDF]: AssignmentEventSeverity.INFO,
  [AssignmentEventAction.FAILED_GENERATION]: AssignmentEventSeverity.ERROR,
};

export const EVENT_CATEGORY_BY_ACTION: Record<AssignmentEventAction, AssignmentEventCategory> = {
  [AssignmentEventAction.CREATED]: AssignmentEventCategory.ASSIGNMENT,
  [AssignmentEventAction.UPDATED]: AssignmentEventCategory.ASSIGNMENT,
  [AssignmentEventAction.UPLOADED_FILE]: AssignmentEventCategory.FILE,
  [AssignmentEventAction.TRIGGERED_GENERATION]: AssignmentEventCategory.AI,
  [AssignmentEventAction.REGENERATED_SECTION]: AssignmentEventCategory.AI,
  [AssignmentEventAction.DOWNLOADED_PDF]: AssignmentEventCategory.PDF,
  [AssignmentEventAction.FAILED_GENERATION]: AssignmentEventCategory.AI,
};
