"use client";

import * as React from "react";
import { UploadCloud, FileText, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/ui/component.utils";
import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/use-file-upload";
import { FormError } from "@/components/forms";

export interface UploadZoneProps {
  onFileSelect: (file: File | null) => void;
  initialFile?: File | null;
  error?: string;
}

export function UploadZone({ onFileSelect, initialFile, error: externalError }: UploadZoneProps) {
  const { file, error, setError, handleFileSelect, clearFile } = useFileUpload(initialFile);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }
    if (selectedFile.type !== "application/pdf" && !selectedFile.type.startsWith("image/")) {
      setError("Only PDF and image files are supported");
      return;
    }
    handleFileSelect(selectedFile);
    onFileSelect(selectedFile);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const onClear = () => {
    clearFile();
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full space-y-2">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed rounded-xl transition-all duration-200",
          isDragging ? "border-accent bg-accent/5 scale-[1.01]" : "border-border hover:bg-surface-secondary",
          file ? "bg-surface-secondary" : "bg-transparent",
          (error || externalError) && "border-danger bg-danger/5"
        )}
      >
        <input
          type="file"
          accept=".pdf,image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
          onChange={onChange}
          ref={fileInputRef}
          disabled={!!file}
          aria-label="Upload source material"
        />
        
        {!file ? (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-foreground-muted pointer-events-none">
            <UploadCloud className={cn("w-12 h-12 mb-3", isDragging ? "text-accent" : "opacity-70")} />
            <p className="text-body mb-1 font-medium text-foreground">
              <span className="text-accent">Click to upload</span> or drag and drop
            </p>
            <p className="text-small opacity-70">PDF or Images up to 10MB</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full px-6 py-8 pointer-events-none z-20">
            <div className="flex items-center gap-3 bg-surface p-4 rounded-lg border border-border shadow-soft-sm w-full max-w-sm">
              <FileText className="w-8 h-8 text-accent shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-small font-semibold text-foreground truncate">{file.name}</p>
                <p className="text-caption text-foreground-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {(error || externalError) && (
        <div className="flex items-center gap-2 text-danger text-small mt-2 bg-danger/10 p-3 rounded-md">
          <AlertCircle className="w-4 h-4" />
          <span>{error || externalError}</span>
        </div>
      )}

      {file && (
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClear} leftIcon={<X className="w-4 h-4" />}>
            Remove File
          </Button>
        </div>
      )}
    </div>
  );
}
