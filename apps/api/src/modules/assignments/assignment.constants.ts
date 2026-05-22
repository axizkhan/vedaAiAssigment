export const ASSIGNMENT_MAX_PAGE_LIMIT = 100;
export const ASSIGNMENT_DEFAULT_PAGE = 1;
export const ASSIGNMENT_DEFAULT_LIMIT = 10;

export const ASSIGNMENT_SORT_FIELDS = ['createdAt', 'updatedAt', 'dueDate', 'title', 'subject'] as const;
export const ASSIGNMENT_SYSTEM_MANAGED_FIELDS = new Set([
  'createdBy',
  'generationJobId',
  'status',
  'extractedText',
  'extractedTextTokenCount',
  's3ObjectKey',
  'promptVersion',
  'createdAt',
  'updatedAt',
]);
