"use client";

import * as React from "react";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/ui/component.utils";
import { Button } from "./button";

export interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
  onFileSelect?: (file: File | null) => void;
  selectedFile?: File | null;
}

export function FileUpload({ className, error, onFileSelect, selectedFile, ...props }: FileUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleClear = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md transition-colors",
          error ? "border-danger bg-danger/10" : "border-border hover:bg-surface-secondary",
          selectedFile ? "bg-surface-secondary" : "bg-transparent"
        )}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          onChange={handleFileChange}
          ref={fileInputRef}
          {...props}
        />
        {!selectedFile ? (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-foreground-muted">
            <UploadCloud className="w-8 h-8 mb-2" />
            <p className="text-small mb-1"><span className="font-semibold">Click to upload</span> or drag and drop</p>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full px-4 z-10 pointer-events-none">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-6 h-6 text-accent" />
              <span className="text-small font-medium text-foreground truncate max-w-[200px]">{selectedFile.name}</span>
            </div>
          </div>
        )}
      </div>
      {selectedFile && (
        <div className="mt-2 flex justify-end">
          <Button variant="ghost" size="sm" onClick={handleClear} type="button" leftIcon={<X className="w-4 h-4" />}>
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
