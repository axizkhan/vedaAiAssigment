import { PageContainer, PageContent } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateAssignmentLoading() {
  return (
    <PageContainer className="max-w-4xl mx-auto">
      <div className="py-4 md:py-6 space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-72" />
      </div>

      <PageContent>
        {/* Stepper skeleton */}
        <div className="hidden sm:flex justify-between mb-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>

        {/* Form card skeleton */}
        <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-soft-sm space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <div className="flex justify-end pt-4 border-t border-border">
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </PageContent>
    </PageContainer>
  );
}
