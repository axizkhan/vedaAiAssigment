import * as React from "react";
import { EmptyState } from "@/components/ui/empty-state";

export interface EmptyStateCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyStateCard({ title, description, icon, action }: EmptyStateCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-soft-sm">
      <EmptyState title={title} description={description} icon={icon} action={action} className="border-none bg-transparent shadow-none" />
    </div>
  );
}
