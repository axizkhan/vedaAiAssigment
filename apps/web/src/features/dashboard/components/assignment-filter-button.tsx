"use client";

import * as React from "react";
import { Filter } from "lucide-react";
import { FilterDropdown } from "@/components/dropdowns/filter-dropdown";
import { ASSIGNMENT_STATUS_FILTERS } from "../constants/dashboard.constants";
import { useAssignmentFilters } from "../hooks/use-assignment-filters";

export function AssignmentFilterButton() {
  const { activeFilters, setStatusFilters } = useAssignmentFilters();

  return (
    <FilterDropdown
      label="Status"
      options={ASSIGNMENT_STATUS_FILTERS}
      selectedValues={activeFilters.status}
      onChange={setStatusFilters}
    />
  );
}
