import { useState, useCallback } from "react";

export function useFileUpload(initialFile: File | null = null) {
  const [file, setFile] = useState<File | null>(initialFile);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((selectedFile: File | null) => {
    setFile(selectedFile);
    setError(null); // Reset error when a new file is selected
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
    setError(null);
  }, []);

  return {
    file,
    error,
    setError,
    handleFileSelect,
    clearFile,
  };
}
