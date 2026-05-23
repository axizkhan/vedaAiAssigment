"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-surface-secondary px-4 text-center">
      <AlertCircle className="w-12 h-12 text-destructive mb-4" />
      <h2 className="text-h3 font-semibold mb-2">Failed to load paper</h2>
      <p className="text-foreground-muted mb-6 max-w-md">
        There was an issue rendering the generated exam paper. The data might be corrupted or temporarily unavailable.
      </p>
      <Button onClick={() => reset()}>Try Again</Button>
    </div>
  );
}
