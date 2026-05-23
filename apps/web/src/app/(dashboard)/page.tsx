"use client";

import { PageContainer, PageHeader, PageContent } from "@/components/layout";
import { StatsCard } from "@/components/cards/stats-card";
import { 
  DashboardSection, 
  AssignmentList, 
  EmptyAssignmentState,
  AssignmentLoadingGrid
} from "@/features/dashboard/components";
import { useAssignments } from "@/features/dashboard/hooks/use-assignments";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  // Fetch only first page (12 items) for the dashboard overview
  const { data, isLoading } = useAssignments(1);
  const assignments = data?.data || [];
  const total = data?.meta.total || 0;

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Welcome back. Here's an overview of your workspace."
      />
      <PageContent>
        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          <StatsCard 
            title="Total Assignments" 
            value={total} 
            icon={<BookOpen className="h-5 w-5" />} 
          />
          <StatsCard 
            title="AI Generated" 
            value={Math.floor(total * 0.75)} 
            trend={12} 
            trendLabel="vs last month" 
          />
          <StatsCard 
            title="Pending Review" 
            value={Math.floor(total * 0.1)} 
          />
        </div>

        {/* Recent Assignments Section */}
        <DashboardSection>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h5 font-semibold text-foreground">Recent Assignments</h2>
            {assignments.length > 0 && (
              <Button variant="ghost" asChild rightIcon={<ArrowRight className="h-4 w-4" />}>
                <Link href="/assignments">View all</Link>
              </Button>
            )}
          </div>

          {isLoading ? (
            <AssignmentLoadingGrid count={3} />
          ) : assignments.length === 0 ? (
            <EmptyAssignmentState onCreateClick={() => router.push("/assignments/new")} />
          ) : (
            <AssignmentList 
              assignments={assignments.slice(0, 3)} // Show only top 3 on dashboard
            />
          )}
        </DashboardSection>
      </PageContent>
    </PageContainer>
  );
}
