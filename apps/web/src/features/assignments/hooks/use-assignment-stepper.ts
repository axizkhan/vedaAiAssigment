import { useAssignmentFlowStore } from "../stores/assignment-flow.store";
import { ASSIGNMENT_STEPS } from "../constants/assignment-flow.constants";

export function useAssignmentStepper() {
  const currentStepIndex = useAssignmentFlowStore((s) => s.currentStepIndex);
  const completedSteps = useAssignmentFlowStore((s) => s.completedSteps);
  
  const setStep = useAssignmentFlowStore((s) => s.setStep);
  const nextStep = useAssignmentFlowStore((s) => s.nextStep);
  const prevStep = useAssignmentFlowStore((s) => s.prevStep);
  const markStepCompleted = useAssignmentFlowStore((s) => s.markStepCompleted);

  const currentStep = ASSIGNMENT_STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === ASSIGNMENT_STEPS.length - 1;

  const canNavigateToStep = (index: number) => {
    // Can always go backward, or to a step if the previous step is completed
    if (index <= currentStepIndex) return true;
    const prevStepId = ASSIGNMENT_STEPS[index - 1].id;
    return completedSteps.has(prevStepId);
  };

  return {
    steps: ASSIGNMENT_STEPS,
    currentStepIndex,
    currentStep,
    isFirstStep,
    isLastStep,
    completedSteps,
    setStep,
    nextStep,
    prevStep,
    markStepCompleted,
    canNavigateToStep,
  };
}
