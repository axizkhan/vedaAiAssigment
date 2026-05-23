"use client";

import * as React from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/ui/component.utils";

export interface UploadDropzoneProps {
  onFileDrop: (file: File) => void;
  disabled?: boolean;
}

export function UploadDropzone({ onFileDrop, disabled }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files?.[0]) {
      onFileDrop(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onFileDrop(e.target.files[0]);
      e.target.value = ""; // Reset to allow re-selecting the same file
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload file by dropping or clicking"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className={cn(
        "relative flex flex-col items-center justify-center w-full min-h-[200px] md:min-h-[240px] border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer",
        isDragging ? "border-accent bg-accent/5 scale-[1.01]" : "border-border hover:border-accent/40 hover:bg-surface-secondary/50",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none"
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt,image/jpeg,image/png"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
        aria-hidden="true"
      />

      <div className="flex flex-col items-center gap-3 p-6 text-center pointer-events-none">
        <div className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center transition-colors",
          isDragging ? "bg-accent/10 text-accent" : "bg-surface-secondary text-foreground-muted"
        )}>
          <UploadCloud className="w-7 h-7" />
        </div>
        <div>
          <p className="text-body font-medium text-foreground">
            <span className="text-accent">Click to upload</span> or drag and drop
          </p>
          <p className="text-small text-foreground-muted mt-1">PDF, DOCX, TXT, or images up to 10MB</p>
        </div>
      </div>
    </div>
  );
}
