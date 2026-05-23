"use client";

import * as React from "react";
import { FormField, FormLabel, FormError } from "@/components/forms";
import { AutosizePrompt } from "./autosize-prompt";
import { PromptCounter } from "./prompt-counter";
import { AiSuggestions } from "./ai-suggestions";
import { MAX_PROMPT_LENGTH } from "../../constants/assignment-flow.constants";
import { usePromptInput } from "../../hooks/use-prompt-input";

export interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function PromptInput({ value: initialValue, onChange, error }: PromptInputProps) {
  const {
    value,
    handleChange,
    applySuggestion,
  } = usePromptInput(initialValue, onChange);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-h5 font-semibold text-foreground">AI Generation Instructions</h3>
        <p className="text-small text-foreground-muted mt-1">Provide custom instructions to guide the AI in generating your assessment.</p>
      </div>

      <FormField>
        <FormLabel>Custom Prompt (Optional)</FormLabel>
        <AutosizePrompt
          placeholder="e.g., Make sure the questions cover topics from chapter 4 to 6, focus on problem-solving..."
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          error={!!error}
          maxLength={MAX_PROMPT_LENGTH}
        />
        <div className="flex justify-between items-center mt-1.5">
          <FormError>{error}</FormError>
          <PromptCounter current={value.length} max={MAX_PROMPT_LENGTH} />
        </div>
      </FormField>

      <AiSuggestions onInsert={applySuggestion} />
    </div>
  );
}

