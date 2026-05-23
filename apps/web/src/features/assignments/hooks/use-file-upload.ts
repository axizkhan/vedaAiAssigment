import { useState, useCallback, useEffect } from "react";
import { validateFile } from "../utils/upload.utils";

export interface UseFileUploadResult {
  file: File | null;
  error: string | null;
  isUploading: boolean;
  progress: number;
  handleFileSelect: (file: File) => void;
  handleRemove: () => void;
  handleRetry: () => void;
}

export function useFileUpload(
  initialFile: File | null = null,
  onFileAccepted?: (file: File | null) => void
): UseFileUploadResult {
  const [file, setFile] = useState<File | null>(initialFile);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Sync with initialFile if it changes externally
  useEffect(() => {
    if (initialFile && initialFile !== file) {
      setFile(initialFile);
    }
  }, [initialFile]);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setError(null);
    const validationError = validateFile(selectedFile);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    // Simulate upload process
    setFile(selectedFile);
    setIsUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          onFileAccepted?.(selectedFile);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  }, [onFileAccepted]);

  const handleRemove = useCallback(() => {
    setFile(null);
    setError(null);
    setIsUploading(false);
    setProgress(0);
    onFileAccepted?.(null);
  }, [onFileAccepted]);

  const handleRetry = useCallback(() => {
    if (file) {
      handleFileSelect(file);
    }
  }, [file, handleFileSelect]);

  return {
    file,
    error,
    isUploading,
    progress,
    handleFileSelect,
    handleRemove,
    handleRetry,
  };
}
