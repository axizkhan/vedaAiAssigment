import { AssignmentLoadingGrid } from "@/features/dashboard/components/assignment-loading-grid";
import { PageContainer, PageContent, PageHeader } from "@/components/layout";
import { AssignmentToolbar } from "@/features/dashboard/components/assignment-toolbar";

export default function Loading() {
  return (
    <PageContainer>
      <PageHeader
        title="Assignments"
        description="Manage and view your generated AI assessments."
      />
      <PageContent>
        <AssignmentToolbar />
        <AssignmentLoadingGrid />
      </PageContent>
    </PageContainer>
  );
}
