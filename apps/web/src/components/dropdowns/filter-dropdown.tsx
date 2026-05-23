"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/component.utils";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export function FilterDropdown({ label, options, selectedValues, onChange }: FilterDropdownProps) {
  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const handleClear = () => onChange([]);

  return (
    <Dropdown
      trigger={
        <Button variant="outline" size="sm" className={cn(selectedValues.length > 0 && "border-accent text-accent hover:bg-accent-soft")}>
          {label} {selectedValues.length > 0 && `(${selectedValues.length})`}
        </Button>
      }
      align="right"
      width="w-64"
    >
      <div className="p-2 flex flex-col gap-1 max-h-64 overflow-y-auto styled-scrollbar">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <DropdownItem key={option.value} onClick={() => toggleOption(option.value)}>
              <div className="flex items-center gap-2 w-full">
                <div className={cn("w-4 h-4 border rounded-sm flex items-center justify-center shrink-0", isSelected ? "bg-accent border-accent text-white" : "border-border")}>
                  {isSelected && <Check className="w-3 h-3" />}
                </div>
                <span className="truncate">{option.label}</span>
              </div>
            </DropdownItem>
          );
        })}
        {selectedValues.length > 0 && (
          <div className="mt-2 pt-2 border-t border-border">
            <Button variant="ghost" size="sm" onClick={handleClear} className="w-full text-foreground-muted">
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </Dropdown>
  );
}
