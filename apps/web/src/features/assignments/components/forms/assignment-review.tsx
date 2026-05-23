"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FileText, Settings, Sparkles, BookOpen, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssignmentStepCard } from "../assignment-step-card";
import { useCreateAssignment } from "../../hooks/use-create-assignment";
import { useAssignmentStepper } from "../../hooks/use-assignment-stepper";
import { calculateTotalMarks, calculateTotalQuestions, formatFileSize } from "../../utils/assignment-flow.utils";
import { QUESTION_TYPES } from "../../constants/question.constants";
import { simulateSubmitAssignment } from "../../services/assignment.service";

export function AssignmentReview() {
  const router = useRouter();
  const { draftData, resetFlow } = useCreateAssignment();
  const { prevStep } = useAssignmentStepper();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const totalQuestions = calculateTotalQuestions(draftData.questions);
  const totalMarks = calculateTotalMarks(draftData.questions);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await simulateSubmitAssignment(draftData);
      resetFlow();
      router.push("/assignments");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getQuestionLabel = (type: string) => {
    return QUESTION_TYPES.find((t) => t.value === type)?.label || type;
  };

  return (
    <AssignmentStepCard>
      <div className="space-y-2 mb-8">
        <h2 className="text-h4 font-semibold text-foreground">Review & Submit</h2>
        <p className="text-small text-foreground-muted">Please confirm the details before generating your assessment.</p>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="p-4 rounded-xl border border-border bg-surface-secondary/30">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-accent" />
            <h3 className="text-body font-semibold text-foreground">Basic Information</h3>
          </div>
          <dl className="space-y-2 text-small">
            <div className="flex justify-between"><dt className="text-foreground-muted">Title</dt><dd className="font-medium text-foreground">{draftData.title || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-foreground-muted">Subject</dt><dd className="font-medium text-foreground">{draftData.subject || "—"}</dd></div>
            {draftData.description && (
              <div><dt className="text-foreground-muted mb-1">Description</dt><dd className="text-foreground">{draftData.description}</dd></div>
            )}
          </dl>
        </div>

        {/* Upload */}
        <div className="p-4 rounded-xl border border-border bg-surface-secondary/30">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-accent" />
            <h3 className="text-body font-semibold text-foreground">Source Material</h3>
          </div>
          <p className="text-small text-foreground">
            {draftData.file ? `${draftData.file.name} (${formatFileSize(draftData.file.size)})` : "No file uploaded"}
          </p>
        </div>

        {/* Questions */}
        <div className="p-4 rounded-xl border border-border bg-surface-secondary/30">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="w-5 h-5 text-accent" />
            <h3 className="text-body font-semibold text-foreground">Question Structure</h3>
          </div>
          <div className="space-y-2 text-small">
            {draftData.questions.map((q, i) => (
              <div key={q.id} className="flex justify-between py-1.5 border-b border-border last:border-0">
                <span className="text-foreground">{getQuestionLabel(q.type)}</span>
                <span className="text-foreground-muted">{q.count} × {q.marks} marks</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 font-semibold text-foreground">
              <span>Total</span>
              <span>{totalQuestions} questions · {totalMarks} marks</span>
            </div>
          </div>
        </div>

        {/* Prompt */}
        {draftData.prompt && (
          <div className="p-4 rounded-xl border border-border bg-surface-secondary/30">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-accent" />
              <h3 className="text-body font-semibold text-foreground">AI Instructions</h3>
            </div>
            <p className="text-small text-foreground italic">"{draftData.prompt}"</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border mt-8 sticky bottom-0 bg-surface/95 backdrop-blur py-4 sm:static sm:bg-transparent sm:py-0 z-20">
        <Button type="button" variant="ghost" onClick={prevStep} disabled={isSubmitting} className="w-full sm:w-auto">
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          loading={isSubmitting}
          size="lg"
          className="w-full sm:w-auto shadow-soft-md"
          rightIcon={<CheckCircle2 className="w-5 h-5" />}
        >
          Submit & Generate
        </Button>
      </div>
    </AssignmentStepCard>
  );
}
