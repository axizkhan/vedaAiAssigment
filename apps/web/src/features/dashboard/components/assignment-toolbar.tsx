"use client";

import * as React from "react";
import { AssignmentSearch } from "./assignment-search";
import { AssignmentFilterButton } from "./assignment-filter-button";

export function AssignmentToolbar() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <AssignmentSearch />
      <div className="flex items-center gap-3">
        <AssignmentFilterButton />
      </div>
    </div>
  );
}
