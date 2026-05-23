"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

export interface QuestionCountSelectorProps {
  value: number;
  onChange: (value: number) => void;
  error?: boolean;
}

export function QuestionCountSelector({ value, onChange, error }: QuestionCountSelectorProps) {
  return (
    <Input
      type="number"
      min={1}
      max={50}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value) || 1)}
      error={error}
      aria-label="Question count"
    />
  );
}
