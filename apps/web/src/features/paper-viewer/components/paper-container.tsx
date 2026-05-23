import * as React from "react";
import { cn } from "@/lib/ui/component.utils";
import { usePaperViewerStore } from "../stores/paper-viewer.store";

export interface PaperContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PaperContainer({ className, children, ...props }: PaperContainerProps) {
  const viewerScale = usePaperViewerStore((s) => s.viewerScale);

  return (
    <div 
      className={cn(
        "w-full flex-1 overflow-x-hidden flex flex-col items-center py-6 sm:py-12 px-4 sm:px-6 space-y-8 bg-surface-secondary",
        "print:p-0 print:bg-white print:space-y-0 print:block",
        className
      )}
      {...props}
    >
      <div 
        style={{ transform: `scale(${viewerScale})`, transformOrigin: "top center" }}
        className="w-full max-w-[100vw] lg:max-w-none transition-transform duration-200"
      >
        {children}
      </div>
    </div>
  );
}
