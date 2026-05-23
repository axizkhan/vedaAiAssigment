"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAssignmentStepper } from "../hooks/use-assignment-stepper";

export interface AssignmentNavigationProps {
  isValid: boolean;
  isSubmitting?: boolean;
  onNext: () => void;
  onBack?: () => void;
}

export function AssignmentNavigation({ isValid, isSubmitting, onNext, onBack }: AssignmentNavigationProps) {
  const { isFirstStep, isLastStep, prevStep } = useAssignmentStepper();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      prevStep();
    }
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border mt-8 sticky bottom-0 bg-surface/95 backdrop-blur py-4 sm:static sm:bg-transparent sm:py-0 z-20">
      {!isFirstStep ? (
        <Button 
          type="button" 
          variant="ghost" 
          onClick={handleBack} 
          disabled={isSubmitting}
          className="w-full sm:w-auto"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back
        </Button>
      ) : (
        <div className="hidden sm:block" /> // Spacer
      )}

      <Button 
        type="button" 
        onClick={onNext} 
        disabled={!isValid || isSubmitting}
        loading={isSubmitting}
        size="lg"
        className="w-full sm:w-auto shadow-soft-md"
        rightIcon={isLastStep ? <CheckCircle2 className="w-5 h-5" /> : <ArrowRight className="w-4 h-4" />}
      >
        {isLastStep ? "Submit & Generate" : "Continue"}
      </Button>
    </div>
  );
}
