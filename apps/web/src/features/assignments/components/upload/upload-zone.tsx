"use client";

import * as React from "react";
import { UploadDropzone } from "./upload-dropzone";
import { UploadPreview } from "./upload-preview";
import { UploadProgress } from "./upload-progress";
import { UploadRetry } from "./upload-retry";
import { UploadError } from "./upload-error";
import { useFileUpload } from "../../hooks/use-file-upload";

export interface UploadZoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  externalError?: string;
}

export function UploadZone({ file: initialFile, onFileChange, externalError }: UploadZoneProps) {
  const {
    file,
    error,
    isUploading,
    progress,
    handleFileSelect,
    handleRemove,
    handleRetry,
  } = useFileUpload(initialFile, onFileChange);

  const displayError = error || externalError;

  return (
    <div className="w-full space-y-4">
      {!file && !isUploading && (
        <UploadDropzone onFileDrop={handleFileSelect} />
      )}

      {isUploading && file && !error && (
        <UploadProgress file={file} progress={progress} />
      )}

      {file && !isUploading && !error && (
        <UploadPreview file={file} onRemove={handleRemove} />
      )}

      {error && file && (
        <UploadRetry error={error} onRetry={handleRetry} onCancel={handleRemove} />
      )}

      {!file && displayError && <UploadError message={displayError} />}
    </div>
  );
}
