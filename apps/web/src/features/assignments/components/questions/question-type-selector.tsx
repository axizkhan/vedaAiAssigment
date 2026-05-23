"use client";

import * as React from "react";
import { Select } from "@/components/ui/select";
import { QUESTION_TYPES } from "../../constants/question.constants";

export interface QuestionTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export function QuestionTypeSelector({ value, onChange, error }: QuestionTypeSelectorProps) {
  return (
    <Select value={value} onChange={(e) => onChange(e.target.value)} error={error} aria-label="Question type">
      {QUESTION_TYPES.map((type) => (
        <option key={type.value} value={type.value}>
          {type.label}
        </option>
      ))}
    </Select>
  );
}
