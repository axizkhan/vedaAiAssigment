"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer, PageContent } from "@/components/layout";

export default function CreateAssignmentError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  return (
    <PageContainer className="max-w-4xl mx-auto">
      <PageContent>
        <div className="flex flex-col items-center justify-center text-center py-16 px-4">
          <div className="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-h4 font-semibold text-foreground mb-2">Something went wrong</h2>
          <p className="text-small text-foreground-muted max-w-sm mb-8">
            An unexpected error occurred while loading the assignment form. Please try again.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push("/assignments")}>
              Go Back
            </Button>
            <Button onClick={reset}>
              Try Again
            </Button>
          </div>
        </div>
      </PageContent>
    </PageContainer>
  );
}
