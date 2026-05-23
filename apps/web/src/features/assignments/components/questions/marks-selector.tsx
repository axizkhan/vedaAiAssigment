"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

export interface MarksSelectorProps {
  value: number;
  onChange: (value: number) => void;
  error?: boolean;
}

export function MarksSelector({ value, onChange, error }: MarksSelectorProps) {
  return (
    <Input
      type="number"
      min={1}
      max={100}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value) || 1)}
      error={error}
      aria-label="Marks per question"
    />
  );
}
