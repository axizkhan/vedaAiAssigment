"use client";

import * as React from "react";
import { calculateTotalMarks, calculateTotalQuestions } from "../../utils/assignment-flow.utils";
import type { QuestionConfig } from "../../types/assignment-flow.types";

export function QuestionValidation({ questions }: { questions: QuestionConfig[] }) {
  const totalMarks = calculateTotalMarks(questions);
  const totalQuestions = calculateTotalQuestions(questions);

  return (
    <div className="flex flex-wrap gap-4 mt-4 p-4 rounded-lg bg-accent/5 border border-accent/20">
      <div className="flex flex-col">
        <span className="text-caption text-foreground-muted">Total Questions</span>
        <span className="text-h5 font-bold text-foreground">{totalQuestions}</span>
      </div>
      <div className="h-10 w-px bg-border hidden sm:block" />
      <div className="flex flex-col">
        <span className="text-caption text-foreground-muted">Total Marks</span>
        <span className="text-h5 font-bold text-foreground">{totalMarks}</span>
      </div>
    </div>
  );
}
