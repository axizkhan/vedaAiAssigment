import { create } from "zustand";
import type { ConfigureStepData } from "../schemas/create-assignment.schema";

interface CreateAssignmentState {
  currentStep: number;
  file: File | null;
  configureData: ConfigureStepData;
  
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  setFile: (file: File | null) => void;
  setConfigureData: (data: ConfigureStepData) => void;
  
  reset: () => void;
}

const initialConfigureData: ConfigureStepData = {
  questions: [{ id: "1", type: "multiple_choice", count: 10, marks: 1 }],
  prompt: "",
};

export const useCreateAssignmentStore = create<CreateAssignmentState>((set) => ({
  currentStep: 0,
  file: null,
  configureData: initialConfigureData,

  setCurrentStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 2) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),

  setFile: (file) => set({ file }),
  setConfigureData: (configureData) => set({ configureData }),

  reset: () => set({
    currentStep: 0,
    file: null,
    configureData: initialConfigureData,
  }),
}));
