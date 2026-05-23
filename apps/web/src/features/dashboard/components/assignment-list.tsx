"use client";

import * as React from "react";
import { AssignmentCard } from "@/components/cards/assignment-card";
import { AssignmentGrid } from "./assignment-grid";
import { AssignmentEmptyPlaceholder } from "./assignment-empty-placeholder";
import type { Assignment } from "../types/dashboard.types";

export interface AssignmentListProps {
  assignments: Assignment[];
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function AssignmentList({ assignments, onEdit, onDuplicate, onDelete }: AssignmentListProps) {
  if (!assignments || assignments.length === 0) {
    return <AssignmentEmptyPlaceholder />;
  }

  return (
    <AssignmentGrid>
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          id={assignment.id}
          title={assignment.title}
          status={assignment.status}
          dueDate={assignment.dueDate}
          questionCount={assignment.questionCount}
          onEdit={onEdit ? () => onEdit(assignment.id) : undefined}
          onDuplicate={onDuplicate ? () => onDuplicate(assignment.id) : undefined}
          onDelete={onDelete ? () => onDelete(assignment.id) : undefined}
        />
      ))}
    </AssignmentGrid>
  );
}
