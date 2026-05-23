"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormLabel, FormError, FormHelper } from "@/components/forms";
import { Button } from "@/components/ui/button";
import type { ConfigureStepData } from "../schemas/create-assignment.schema";

const SUGGESTIONS = [
  "Focus on critical thinking and application of concepts.",
  "Include real-world examples in the multiple choice questions.",
  "Ensure the essay prompt is open-ended and thought-provoking.",
];

export function PromptInput() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<ConfigureStepData>();
  const promptValue = watch("prompt") || "";
  const maxLength = 1000;

  const handleSuggestionClick = (suggestion: string) => {
    const current = promptValue;
    const newValue = current ? `${current}\n${suggestion}` : suggestion;
    if (newValue.length <= maxLength) {
      setValue("prompt", newValue, { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-h5 font-semibold text-foreground">AI Instructions</h3>
          <p className="text-small text-foreground-muted">Provide custom instructions for the AI generation.</p>
        </div>
      </div>

      <FormField>
        <FormLabel>Custom Prompt (Optional)</FormLabel>
        <Textarea
          {...register("prompt")}
          placeholder="e.g., Make sure the questions cover topics from chapter 4 to 6..."
          className="min-h-[120px] resize-y"
          error={!!errors.prompt}
        />
        <div className="flex justify-between items-center mt-1">
          <FormError>{errors.prompt?.message}</FormError>
          <FormHelper className={promptValue.length > maxLength ? "text-danger" : ""}>
            {promptValue.length}/{maxLength}
          </FormHelper>
        </div>
      </FormField>

      <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-small font-semibold text-foreground">AI Suggestions</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((suggestion, idx) => (
            <Button
              key={idx}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick(suggestion)}
              className="text-caption bg-surface text-foreground-muted hover:text-accent hover:border-accent border-dashed"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
