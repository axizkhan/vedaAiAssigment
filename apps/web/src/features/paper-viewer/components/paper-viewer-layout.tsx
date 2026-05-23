import * as React from "react";
import { cn } from "@/lib/ui/component.utils";
import { PaperToolbar } from "./paper-toolbar";

export interface PaperViewerLayoutProps {
  children: React.ReactNode;
}

export function PaperViewerLayout({ children }: PaperViewerLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-surface-secondary print:bg-white">
      {/* Sticky Toolbar */}
      <div className="sticky top-0 z-40 print:hidden">
        <PaperToolbar />
      </div>

      {/* Main Container */}
      <main className="flex-1 w-full relative print:m-0 print:p-0">
        {children}
      </main>
    </div>
  );
}
