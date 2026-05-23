import * as React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export interface UploadRetryProps {
  error: string;
  onRetry: () => void;
  onCancel: () => void;
}

export function UploadRetry({ error, onRetry, onCancel }: UploadRetryProps) {
  return (
    <div className="w-full p-4 border rounded-xl border-destructive/50 bg-destructive/10 flex flex-col items-center justify-center text-center space-y-3">
      <AlertCircle className="w-8 h-8 text-destructive" />
      <div>
        <p className="text-small font-semibold text-foreground">Upload Failed</p>
        <p className="text-small-muted text-destructive">{error}</p>
      </div>
      <div className="flex items-center justify-center space-x-3 mt-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={onRetry}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
