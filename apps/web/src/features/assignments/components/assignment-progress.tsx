"use client";

import * as React from "react";
import { useAssignmentStepper } from "../hooks/use-assignment-stepper";
import { ASSIGNMENT_STEPS } from "../constants/assignment-flow.constants";

export function AssignmentProgress() {
  const { currentStepIndex } = useAssignmentStepper();
  const progress = ((currentStepIndex) / (ASSIGNMENT_STEPS.length - 1)) * 100;

  return (
    <div className="w-full h-1 bg-border rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <div
        className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
