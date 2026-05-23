"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { FormField, FormLabel, FormError, FormHelper } from "@/components/forms";
import { AssignmentNavigation } from "../assignment-navigation";
import { AssignmentStepCard } from "../assignment-step-card";
import { useCreateAssignment } from "../../hooks/use-create-assignment";
import { basicInfoSchema, type BasicInfoFormData } from "../../schemas/basic-info.schema";
import { SUBJECT_OPTIONS } from "../../constants/question.constants";

export function BasicInfoForm() {
  const { draftData, completeStep } = useCreateAssignment();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      title: draftData.title,
      subject: draftData.subject,
      description: draftData.description || "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: BasicInfoFormData) => {
    completeStep("basic", data);
  };

  return (
    <AssignmentStepCard>
      <div className="space-y-2 mb-8">
        <h2 className="text-h4 font-semibold text-foreground">Basic Information</h2>
        <p className="text-small text-foreground-muted">Enter the title and subject for your new assessment.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField>
          <FormLabel required htmlFor="title">Assignment Title</FormLabel>
          <Input
            id="title"
            placeholder="e.g., Mid-Term Physics Exam"
            {...register("title")}
            error={!!errors.title}
            autoFocus
          />
          <FormError>{errors.title?.message}</FormError>
        </FormField>

        <FormField>
          <FormLabel required htmlFor="subject">Subject</FormLabel>
          <Select id="subject" {...register("subject")} error={!!errors.subject}>
            <option value="">Select a subject</option>
            {SUBJECT_OPTIONS.map((subj) => (
              <option key={subj} value={subj}>{subj}</option>
            ))}
          </Select>
          <FormError>{errors.subject?.message}</FormError>
        </FormField>

        <FormField>
          <FormLabel htmlFor="description">Description (Optional)</FormLabel>
          <Textarea
            id="description"
            placeholder="Brief description of this assessment..."
            {...register("description")}
            className="min-h-[100px] resize-y"
          />
          <FormHelper>Max 500 characters</FormHelper>
          <FormError>{errors.description?.message}</FormError>
        </FormField>

        <AssignmentNavigation isValid={isValid} onNext={handleSubmit(onSubmit)} />
      </form>
    </AssignmentStepCard>
  );
}
