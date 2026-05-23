import * as React from "react";
import { MoreVertical, FileText, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { Skeleton } from "@/components/ui/skeleton";

export interface AssignmentCardProps {
  id: string;
  title: string;
  status: "draft" | "published" | "archived";
  dueDate?: string;
  questionCount?: number;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export function AssignmentCard({
  title,
  status,
  dueDate,
  questionCount,
  onEdit,
  onDuplicate,
  onDelete,
}: AssignmentCardProps) {
  const statusConfig = {
    draft: { variant: "secondary" as const, label: "Draft" },
    published: { variant: "success" as const, label: "Published" },
    archived: { variant: "default" as const, label: "Archived" },
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-soft-sm transition-all hover-lift">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-h5 font-semibold text-foreground line-clamp-2">
            {title}
          </h3>
          <Dropdown
            align="right"
            trigger={
              <button className="rounded-md p-1.5 text-foreground-muted hover:bg-surface-secondary hover:text-foreground focus-ring">
                <MoreVertical className="h-4 w-4" />
              </button>
            }
          >
            <DropdownItem onClick={onEdit}>Edit</DropdownItem>
            <DropdownItem onClick={onDuplicate}>Duplicate</DropdownItem>
            <DropdownItem onClick={onDelete} danger>
              Delete
            </DropdownItem>
          </Dropdown>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-small text-foreground-muted">
          {questionCount !== undefined && (
            <div className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              <span>{questionCount} Questions</span>
            </div>
          )}
          {dueDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{dueDate}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <Badge variant={statusConfig[status].variant}>
          {statusConfig[status].label}
        </Badge>
        <span className="flex items-center gap-1 text-caption text-foreground-muted">
          <Clock className="h-3.5 w-3.5" />
          Updated 2h ago
        </span>
      </div>
    </div>
  );
}

export function AssignmentCardSkeleton() {
  return (
    <div className="flex h-48 flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-soft-sm">
      <div>
        <div className="flex justify-between">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-8 w-8" />
        </div>
        <Skeleton className="mt-2 h-6 w-1/2" />
        <div className="mt-4 flex gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}
