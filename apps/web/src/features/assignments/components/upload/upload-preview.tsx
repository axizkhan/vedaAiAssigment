"use client";

import * as React from "react";
import { FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "../../utils/assignment-flow.utils";

export interface UploadPreviewProps {
  file: File;
  onRemove: () => void;
}

export function UploadPreview({ file, onRemove }: UploadPreviewProps) {
  return (
    <div className="flex items-center gap-4 w-full p-4 rounded-xl border border-border bg-surface-secondary/40 shadow-soft-sm">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-accent shrink-0">
        <FileText className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-small font-semibold text-foreground truncate">{file.name}</p>
        <p className="text-caption text-foreground-muted">{formatFileSize(file.size)}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={onRemove} aria-label="Remove file" className="shrink-0 text-foreground-muted hover:text-danger hover:bg-danger/10">
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
