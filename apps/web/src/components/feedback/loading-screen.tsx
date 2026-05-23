import * as React from "react";
import { Loader } from "@/components/ui/loader";

export function LoadingScreen({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-border bg-surface p-8 text-center shadow-soft-sm">
      <Loader size="lg" />
      <p className="mt-4 text-small font-medium text-foreground-muted">{text}</p>
    </div>
  );
}
