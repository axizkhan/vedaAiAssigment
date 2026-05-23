"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/ui/component.utils";
import { useAssignmentStepper } from "../hooks/use-assignment-stepper";

export function AssignmentStepper() {
  const { steps, currentStepIndex, completedSteps, setStep, canNavigateToStep } = useAssignmentStepper();

  return (
    <div className="w-full relative py-4">
      {/* Background Line */}
      <div className="absolute top-8 left-0 w-full h-1 bg-border z-0 hidden sm:block rounded-full" />
      
      {/* Progress Line */}
      <motion.div 
        className="absolute top-8 left-0 h-1 bg-accent z-0 hidden sm:block origin-left rounded-full"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: currentStepIndex / (steps.length - 1) }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{ width: "100%" }}
      />

      <div className="relative z-10 flex flex-row justify-between gap-2 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 scrollbar-hide">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.id);
          const isActive = currentStepIndex === index;
          const canClick = canNavigateToStep(index);

          return (
            <button
              key={step.id}
              onClick={() => canClick && setStep(index)}
              disabled={!canClick}
              className={cn(
                "flex flex-col items-center min-w-[80px] group outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-lg p-1",
                canClick ? "cursor-pointer" : "cursor-not-allowed opacity-50"
              )}
              aria-current={isActive ? "step" : undefined}
            >
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isActive || isCompleted ? "var(--accent)" : "var(--surface)",
                  borderColor: isActive || isCompleted ? "var(--accent)" : "var(--border)",
                  color: isActive || isCompleted ? "var(--primary-foreground)" : "var(--foreground-muted)",
                }}
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold text-small transition-all duration-300 shadow-sm",
                  isActive && "ring-4 ring-accent/20 scale-110",
                  !isActive && canClick && "group-hover:border-accent/50"
                )}
              >
                {isCompleted && !isActive ? <Check className="w-5 h-5" /> : index + 1}
              </motion.div>
              
              <div className="mt-3 text-center hidden sm:block">
                <span className={cn(
                  "block text-small font-semibold transition-colors duration-300",
                  isActive ? "text-foreground" : isCompleted ? "text-foreground" : "text-foreground-muted"
                )}>
                  {step.title}
                </span>
                <span className="block text-caption text-foreground-muted mt-0.5 max-w-[100px] truncate">
                  {step.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
