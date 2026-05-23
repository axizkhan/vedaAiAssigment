"use client";

import * as React from "react";
import { AssignmentNavigation } from "../assignment-navigation";
import { AssignmentStepCard } from "../assignment-step-card";
import { PromptInput } from "../prompts/prompt-input";
import { useCreateAssignment } from "../../hooks/use-create-assignment";
import { MAX_PROMPT_LENGTH } from "../../constants/assignment-flow.constants";

export function PromptForm() {
  const { draftData, completeStep, updateDraftData } = useCreateAssignment();
  const [prompt, setPrompt] = React.useState(draftData.prompt);
  const [error, setError] = React.useState<string>();

  const handleChange = (value: string) => {
    setPrompt(value);
    updateDraftData({ prompt: value });
    if (value.length > MAX_PROMPT_LENGTH) {
      setError(`Prompt must be less than ${MAX_PROMPT_LENGTH} characters`);
    } else {
      setError(undefined);
    }
  };

  const handleNext = () => {
    completeStep("prompt", { prompt });
  };

  // Prompt is optional, so it's always valid unless over character limit
  const isValid = prompt.length <= MAX_PROMPT_LENGTH;

  return (
    <AssignmentStepCard>
      <PromptInput value={prompt} onChange={handleChange} error={error} />
      <AssignmentNavigation isValid={isValid} onNext={handleNext} />
    </AssignmentStepCard>
  );
}
