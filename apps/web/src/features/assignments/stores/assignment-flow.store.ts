import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AssignmentDraftData, StepId } from "../types/assignment-flow.types";
import { ASSIGNMENT_STEPS } from "../constants/assignment-flow.constants";

interface AssignmentFlowState {
  currentStepIndex: number;
  draftData: AssignmentDraftData;
  completedSteps: Set<StepId>;
  
  // Navigation
  setStep: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  markStepCompleted: (stepId: StepId) => void;
  
  // Data updates
  updateDraftData: (data: Partial<AssignmentDraftData>) => void;
  
  // Reset
  resetFlow: () => void;
}

const initialDraftData: AssignmentDraftData = {
  title: "",
  subject: "",
  description: "",
  file: null,
  questions: [{ id: "1", type: "mcq", count: 10, marks: 1 }],
  prompt: "",
};

export const useAssignmentFlowStore = create<AssignmentFlowState>()(
  persist(
    (set, get) => ({
      currentStepIndex: 0,
      draftData: initialDraftData,
      completedSteps: new Set<StepId>(),

      setStep: (index) => set({ currentStepIndex: Math.max(0, Math.min(index, ASSIGNMENT_STEPS.length - 1)) }),
      
      nextStep: () => set((state) => {
        const nextIndex = Math.min(state.currentStepIndex + 1, ASSIGNMENT_STEPS.length - 1);
        return { currentStepIndex: nextIndex };
      }),
      
      prevStep: () => set((state) => {
        const prevIndex = Math.max(state.currentStepIndex - 1, 0);
        return { currentStepIndex: prevIndex };
      }),
      
      markStepCompleted: (stepId) => set((state) => {
        const newSet = new Set(state.completedSteps);
        newSet.add(stepId);
        return { completedSteps: newSet };
      }),

      updateDraftData: (data) => set((state) => ({
        draftData: { ...state.draftData, ...data }
      })),

      resetFlow: () => set({
        currentStepIndex: 0,
        draftData: initialDraftData,
        completedSteps: new Set<StepId>(),
      }),
    }),
    {
      name: "assignment-flow-storage",
      // file is not serializable naturally in localStorage, but since this is frontend execution we just need it during the session.
      // We will partialize to omit the file object from localStorage to prevent JSON errors, though the user might lose the file on hard refresh.
      partialize: (state) => ({
        currentStepIndex: state.currentStepIndex,
        draftData: { ...state.draftData, file: null },
      }),
    }
  )
);
