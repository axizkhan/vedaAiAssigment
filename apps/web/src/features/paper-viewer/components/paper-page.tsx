import * as React from "react";
import { cn } from "@/lib/ui/component.utils";

export interface PaperPageProps extends React.HTMLAttributes<HTMLDivElement> {}

export const PaperPage = React.forwardRef<HTMLDivElement, PaperPageProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // White paper base, black text to force print realism even in dark mode
          "bg-white text-black shadow-soft-lg mx-auto overflow-hidden",
          "print:shadow-none print:m-0",
          
          // Desktop A4 dimensions mapping
          "w-full lg:w-[210mm]",
          
          // Print sizing logic
          "print:w-[210mm] print:min-h-[297mm]",
          
          // Print safe CSS rules
          "break-inside-avoid page-break-inside-avoid",
          className
        )}
        {...props}
      >
        <div className="p-6 md:p-10 lg:p-[20mm]">
          {children}
        </div>
      </div>
    );
  }
);
PaperPage.displayName = "PaperPage";
