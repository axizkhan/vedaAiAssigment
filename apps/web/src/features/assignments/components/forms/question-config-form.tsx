"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssignmentNavigation } from "../assignment-navigation";
import { AssignmentStepCard } from "../assignment-step-card";
import { QuestionConfigurator } from "../questions/question-configurator";
import { useCreateAssignment } from "../../hooks/use-create-assignment";
import { questionsSchema, type QuestionFormData } from "../../schemas/question.schema";

export function QuestionConfigForm() {
  const { draftData, completeStep, updateDraftData } = useCreateAssignment();

  const methods = useForm<QuestionFormData>({
    resolver: zodResolver(questionsSchema),
    defaultValues: {
      questions: draftData.questions.length > 0 ? draftData.questions : [
        { id: "init", type: "mcq", count: 5, marks: 1 }
      ],
    },
    mode: "onChange",
  });

  const { handleSubmit, formState: { isValid }, watch } = methods;

  // Sync to draft when it changes and is valid
  React.useEffect(() => {
    const subscription = watch((value) => {
      if (value.questions) {
        updateDraftData({ questions: value.questions as any });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, updateDraftData]);

  const onSubmit = (data: QuestionFormData) => {
    completeStep("questions", data);
  };

  return (
    <AssignmentStepCard>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <QuestionConfigurator />
          <AssignmentNavigation isValid={isValid} onNext={handleSubmit(onSubmit)} />
        </form>
      </FormProvider>
    </AssignmentStepCard>
  );
}
