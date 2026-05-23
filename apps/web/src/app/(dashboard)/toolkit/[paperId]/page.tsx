"use client";

import * as React from "react";
import { PaperViewerLayout } from "@/features/paper-viewer/components/paper-viewer-layout";
import { PaperContainer } from "@/features/paper-viewer/components/paper-container";
import { PaperPage } from "@/features/paper-viewer/components/paper-page";
import { PaperHeader } from "@/features/paper-viewer/components/paper-header";
import { StudentInfoSection } from "@/features/paper-viewer/components/student-info-section";
import { PaperSection } from "@/features/paper-viewer/components/paper-section";
import { usePaperViewer } from "@/features/paper-viewer/hooks/use-paper-viewer";
import { Loader2 } from "lucide-react";

export default function PaperViewerPage({ params }: { params: { paperId: string } }) {
  const { data: paper, isLoading, isError } = usePaperViewer(params.paperId);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-foreground-muted">Generating authentic layout...</p>
      </div>
    );
  }

  if (isError || !paper) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen text-danger">
        Failed to load the generated paper.
      </div>
    );
  }

  return (
    <PaperViewerLayout>
      <PaperContainer>
        <PaperPage>
          <PaperHeader />
          <StudentInfoSection />
          
          {paper.sections.map((section, index) => (
            <PaperSection key={section.id} section={section} sectionIndex={index} />
          ))}
        </PaperPage>
      </PaperContainer>
    </PaperViewerLayout>
  );
}
