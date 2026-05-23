"use client";

import * as React from "react";
import { cn } from "@/lib/ui/component.utils";

export interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        type="date"
        className={cn(
          "flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-small",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-danger focus-visible:ring-danger" : "border-border",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
DatePicker.displayName = "DatePicker";

export { DatePicker };
