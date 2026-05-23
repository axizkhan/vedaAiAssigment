"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useCreateAssignmentStore } from "../stores/create-assignment.store";
import { configureStepSchema, type ConfigureStepData } from "../schemas/create-assignment.schema";
import { QuestionConfiguration } from "./question-configuration";
import { PromptInput } from "./prompt-input";

export function StepTwoConfigure() {
  const configureData = useCreateAssignmentStore((s) => s.configureData);
  const setConfigureData = useCreateAssignmentStore((s) => s.setConfigureData);
  const nextStep = useCreateAssignmentStore((s) => s.nextStep);
  const prevStep = useCreateAssignmentStore((s) => s.prevStep);

  const methods = useForm<ConfigureStepData>({
    resolver: zodResolver(configureStepSchema),
    defaultValues: configureData,
    mode: "onBlur",
  });

  const onSubmit = (data: ConfigureStepData) => {
    setConfigureData(data);
    nextStep();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-h4 font-semibold text-foreground mb-2">Configure Assessment</h2>
          <p className="text-small text-foreground-muted mb-6">
            Define the structure, question types, and provide any custom instructions for the AI.
          </p>

          <QuestionConfiguration />
        </div>

        <div className="pt-6 border-t border-border">
          <PromptInput />
        </div>

        <div className="flex justify-between pt-6 border-t border-border">
          <Button type="button" variant="ghost" onClick={prevStep}>
            Back
          </Button>
          <Button type="submit" size="lg" disabled={!methods.formState.isValid}>
            Review & Generate
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
