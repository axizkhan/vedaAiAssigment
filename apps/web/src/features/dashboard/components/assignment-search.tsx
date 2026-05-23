"use client";

import * as React from "react";
import { SearchInput } from "@/components/ui/search-input";
import { useAssignmentSearch } from "../hooks/use-assignment-search";
import { DASHBOARD_CONSTANTS } from "../constants/dashboard.constants";

export function AssignmentSearch() {
  const { searchQuery, setSearchQuery } = useAssignmentSearch();
  const [localQuery, setLocalQuery] = React.useState(searchQuery);

  // Debounce search updates
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery);
    }, DASHBOARD_CONSTANTS.DEBOUNCE.SEARCH);

    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery]);

  // Sync external changes (like clear filters)
  React.useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  return (
    <SearchInput
      placeholder="Search assignments..."
      value={localQuery}
      onChange={(e) => setLocalQuery(e.target.value)}
      className="w-full md:w-80 lg:w-96"
    />
  );
}
