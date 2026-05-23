"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadZone } from "./upload-zone";
import { Button } from "@/components/ui/button";
import { useCreateAssignmentStore } from "../stores/create-assignment.store";
import { uploadStepSchema, type UploadStepData } from "../schemas/create-assignment.schema";

export function StepOneUpload() {
  const file = useCreateAssignmentStore((s) => s.file);
  const setFile = useCreateAssignmentStore((s) => s.setFile);
  const nextStep = useCreateAssignmentStore((s) => s.nextStep);

  const {
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<UploadStepData>({
    resolver: zodResolver(uploadStepSchema),
    defaultValues: {
      file: file || undefined,
    },
    mode: "onChange",
  });

  // Re-trigger validation when Zustand store rehydrates or changes file
  React.useEffect(() => {
    if (file) {
      setValue("file", file, { shouldValidate: true });
    }
  }, [file, setValue]);

  const onSubmit = (data: UploadStepData) => {
    setFile(data.file);
    nextStep();
  };

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    if (selectedFile) {
      setValue("file", selectedFile, { shouldValidate: true });
    } else {
      setValue("file", undefined as any, { shouldValidate: true });
    }
    trigger("file");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-h4 font-semibold text-foreground mb-2">Upload Source Material</h2>
        <p className="text-small text-foreground-muted mb-6">
          Provide the PDF or images that the AI will use to generate the assessment.
        </p>

        <UploadZone
          onFileSelect={handleFileSelect}
          initialFile={file}
          error={errors.file?.message}
        />
      </div>

      <div className="flex justify-end pt-4 border-t border-border">
        <Button type="submit" size="lg" disabled={!isValid || !file}>
          Continue
        </Button>
      </div>
    </form>
  );
}
