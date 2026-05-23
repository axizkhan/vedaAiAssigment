import * as React from "react";
import { AssignmentCardSkeleton } from "@/components/cards/assignment-card";
import { AssignmentGrid } from "./assignment-grid";

export function AssignmentLoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <AssignmentGrid>
      {Array.from({ length: count }).map((_, i) => (
        <AssignmentCardSkeleton key={i} />
      ))}
    </AssignmentGrid>
  );
}
