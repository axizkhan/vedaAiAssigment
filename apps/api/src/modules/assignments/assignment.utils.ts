import { ASSIGNMENT_SYSTEM_MANAGED_FIELDS } from './assignment.constants';

export function stripSystemManagedAssignmentFields<T extends Record<string, unknown>>(input: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(input).filter(([key]) => !ASSIGNMENT_SYSTEM_MANAGED_FIELDS.has(key))
  ) as Partial<T>;
}

export function changedFieldNames(input: Record<string, unknown>): string[] {
  return Object.keys(stripSystemManagedAssignmentFields(input));
}
