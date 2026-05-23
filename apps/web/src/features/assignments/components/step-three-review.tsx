"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileText, Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateAssignmentStore } from "../stores/create-assignment.store";
import { InformationCard } from "@/components/cards/information-card";

export function StepThreeReview() {
  const router = useRouter();
  const file = useCreateAssignmentStore((s) => s.file);
  const configureData = useCreateAssignmentStore((s) => s.configureData);
  const prevStep = useCreateAssignmentStore((s) => s.prevStep);
  const reset = useCreateAssignmentStore((s) => s.reset);
  
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    reset();
    router.push("/assignments");
  };

  const totalQuestions = configureData.questions.reduce((sum, q) => sum + (q.count || 0), 0);
  const totalMarks = configureData.questions.reduce((sum, q) => sum + ((q.count || 0) * (q.marks || 0)), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-h4 font-semibold text-foreground mb-2">Review & Generate</h2>
        <p className="text-small text-foreground-muted mb-6">
          Please review your settings before the AI begins generating your assessment.
        </p>

        <div className="space-y-6">
          <InformationCard
            title="Source Material"
            description={file?.name || "No file selected"}
            icon={<FileText className="w-5 h-5" />}
          />

          <InformationCard
            title="Structure"
            description={`${totalQuestions} Questions total (${totalMarks} Marks)`}
            icon={<Settings className="w-5 h-5" />}
          />

          {configureData.prompt && (
            <InformationCard
              title="Custom Instructions"
              description={`"${configureData.prompt}"`}
              icon={<Sparkles className="w-5 h-5" />}
            />
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-border">
        <Button type="button" variant="ghost" onClick={prevStep} disabled={isGenerating}>
          Back
        </Button>
        <Button 
          onClick={handleGenerate} 
          size="lg" 
          loading={isGenerating}
          leftIcon={<CheckCircle2 className="w-5 h-5" />}
        >
          Generate Assessment
        </Button>
      </div>
    </div>
  );
}
