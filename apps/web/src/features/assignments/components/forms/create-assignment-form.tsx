"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAssignmentStepper } from "../../hooks/use-assignment-stepper";
import { BasicInfoForm } from "./basic-info-form";
import { AssignmentUploadForm } from "./assignment-details-form";
import { QuestionConfigForm } from "./question-config-form";
import { PromptForm } from "./prompt-form";
import { AssignmentReview } from "./assignment-review";

const stepVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

export function CreateAssignmentForm() {
  const { currentStepIndex } = useAssignmentStepper();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStepIndex}
        variants={stepVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        {currentStepIndex === 0 && <BasicInfoForm />}
        {currentStepIndex === 1 && <AssignmentUploadForm />}
        {currentStepIndex === 2 && <QuestionConfigForm />}
        {currentStepIndex === 3 && <PromptForm />}
        {currentStepIndex === 4 && <AssignmentReview />}
      </motion.div>
    </AnimatePresence>
  );
}
