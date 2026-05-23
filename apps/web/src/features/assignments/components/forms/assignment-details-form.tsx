"use client";

import * as React from "react";
import { AssignmentNavigation } from "../assignment-navigation";
import { AssignmentStepCard } from "../assignment-step-card";
import { UploadZone } from "../upload/upload-zone";
import { useCreateAssignment } from "../../hooks/use-create-assignment";
import { useAssignmentFlowStore } from "../../stores/assignment-flow.store";

export function AssignmentUploadForm() {
  const { draftData, completeStep, updateDraftData } = useCreateAssignment();
  const file = useAssignmentFlowStore((s) => s.draftData.file);

  const handleFileChange = (selectedFile: File | null) => {
    updateDraftData({ file: selectedFile });
  };

  const handleNext = () => {
    if (file) {
      completeStep("upload", { file });
    }
  };

  return (
    <AssignmentStepCard>
      <div className="space-y-2 mb-8">
        <h2 className="text-h4 font-semibold text-foreground">Upload Source Material</h2>
        <p className="text-small text-foreground-muted">Provide the PDF, DOCX, or images the AI will use to generate the assessment.</p>
      </div>

      <UploadZone
        file={file}
        onFileChange={handleFileChange}
      />

      <AssignmentNavigation isValid={!!file} onNext={handleNext} />
    </AssignmentStepCard>
  );
}
