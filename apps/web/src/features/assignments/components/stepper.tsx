"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/ui/component.utils";

export interface Step {
  title: string;
  description?: string;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full relative">
      <div className="absolute top-4 left-0 w-full h-[2px] bg-border z-0 hidden sm:block" />
      <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isActive = currentStep === index;
          const isPending = currentStep < index;

          return (
            <div key={step.title} className="flex flex-row sm:flex-col items-center gap-3 sm:gap-2">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isActive ? "var(--accent)" : "var(--surface)",
                  borderColor: isCompleted || isActive ? "var(--accent)" : "var(--border)",
                  color: isCompleted || isActive ? "var(--primary-foreground)" : "var(--foreground-muted)",
                }}
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold text-small transition-colors",
                  isActive && "ring-4 ring-accent/20"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </motion.div>
              
              <div className="flex flex-col sm:items-center text-left sm:text-center">
                <span className={cn(
                  "text-small font-semibold transition-colors",
                  isActive ? "text-foreground" : isCompleted ? "text-foreground" : "text-foreground-muted"
                )}>
                  {step.title}
                </span>
                {step.description && (
                  <span className="text-caption text-foreground-muted hidden md:block mt-0.5">
                    {step.description}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Progress Line active state overlay */}
      <motion.div 
        className="absolute top-4 left-0 h-[2px] bg-accent z-0 hidden sm:block origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: currentStep / (steps.length - 1) }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ width: "100%" }}
      />
    </div>
  );
}
