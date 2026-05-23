"use client";

import * as React from "react";
import { useAssignmentFlowStore } from "../stores/assignment-flow.store";

/**
 * Syncs React Hook Form default values with the Zustand store on mount,
 * and writes form data back to the store when the step is completed.
 */
export function usePersistedForm<T extends Record<string, any>>(
  stepKey: keyof Pick<ReturnType<typeof useAssignmentFlowStore.getState>["draftData"], "title" | "subject" | "description" | "prompt">,
) {
  const draftData = useAssignmentFlowStore((s) => s.draftData);
  const updateDraftData = useAssignmentFlowStore((s) => s.updateDraftData);

  const persistField = React.useCallback((key: string, value: any) => {
    updateDraftData({ [key]: value });
  }, [updateDraftData]);

  return { draftData, persistField, updateDraftData };
}
