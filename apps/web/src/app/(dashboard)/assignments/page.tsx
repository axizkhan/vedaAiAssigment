"use client";

import * as React from "react";
import { PageContainer, PageHeader, PageContent } from "@/components/layout";
import { 
  AssignmentToolbar, 
  AssignmentList, 
  AssignmentInfiniteScroll,
  AssignmentLoadingGrid,
  CreateAssignmentFab
} from "@/features/dashboard/components";
import { useInfiniteAssignments } from "@/features/dashboard/hooks/use-infinite-assignments";

export default function AssignmentsPage() {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteAssignments();

  const assignments = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  return (
    <PageContainer>
      <PageHeader
        title="Assignments"
        description="Manage and view your generated AI assessments."
      />
      
      <PageContent>
        <AssignmentToolbar />

        {isError && (
          <div className="rounded-xl border border-danger/20 bg-danger/5 p-4 text-center text-danger">
            Failed to load assignments. Please try again.
          </div>
        )}

        {isLoading ? (
          <AssignmentLoadingGrid />
        ) : (
          <>
            <AssignmentList assignments={assignments} />
            <AssignmentInfiniteScroll
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
            />
          </>
        )}
      </PageContent>

      <CreateAssignmentFab />
    </PageContainer>
  );
}
