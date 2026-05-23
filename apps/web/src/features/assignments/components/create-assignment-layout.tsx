"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageContainer, PageHeader, PageContent } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { AssignmentStepper } from "./assignment-stepper";
import { AssignmentProgress } from "./assignment-progress";
import { CreateAssignmentForm } from "./forms/create-assignment-form";
import { useAssignmentFlowStore } from "../stores/assignment-flow.store";

export function CreateAssignmentLayout() {
  const router = useRouter();
  const resetFlow = useAssignmentFlowStore((s) => s.resetFlow);

  const handleCancel = () => {
    resetFlow();
    router.push("/assignments");
  };

  return (
    <PageContainer className="max-w-4xl mx-auto">
      <div className="py-4 md:py-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="mb-2 -ml-3"
        >
          Back to Assignments
        </Button>

        <PageHeader
          title="Create Assignment"
          description="Generate a new AI-powered assessment from your course materials."
        />
      </div>

      <PageContent>
        {/* Mobile progress bar */}
        <div className="block sm:hidden mb-6">
          <AssignmentProgress />
        </div>

        {/* Desktop stepper */}
        <div className="hidden sm:block mb-10">
          <AssignmentStepper />
        </div>

        <CreateAssignmentForm />
      </PageContent>
    </PageContainer>
  );
}
