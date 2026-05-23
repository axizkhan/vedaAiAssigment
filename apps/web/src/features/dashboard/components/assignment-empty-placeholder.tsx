import * as React from "react";
import { SearchX } from "lucide-react";

export function AssignmentEmptyPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-secondary text-foreground-muted">
        <SearchX className="h-8 w-8" />
      </div>
      <h3 className="text-h5 font-semibold text-foreground">No assignments found</h3>
      <p className="mt-2 text-small text-foreground-muted max-w-sm">
        Try adjusting your search query or removing some filters to see more results.
      </p>
    </div>
  );
}
