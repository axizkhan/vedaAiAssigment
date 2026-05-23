"use client";

import * as React from "react";
import { useAssignmentFlowStore } from "../stores/assignment-flow.store";

export function useCreateAssignment() {
  const draftData = useAssignmentFlowStore((s) => s.draftData);
  const updateDraftData = useAssignmentFlowStore((s) => s.updateDraftData);
  const resetFlow = useAssignmentFlowStore((s) => s.resetFlow);
  const markStepCompleted = useAssignmentFlowStore((s) => s.markStepCompleted);
  const nextStep = useAssignmentFlowStore((s) => s.nextStep);

  const completeStep = React.useCallback(
    (stepId: Parameters<typeof markStepCompleted>[0], data?: Partial<typeof draftData>) => {
      if (data) updateDraftData(data);
      markStepCompleted(stepId);
      nextStep();
    },
    [markStepCompleted, nextStep, updateDraftData]
  );

  return {
    draftData,
    updateDraftData,
    resetFlow,
    completeStep,
  };
}
