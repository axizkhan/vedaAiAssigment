"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";

export interface UploadErrorProps {
  message: string;
}

export function UploadError({ message }: UploadErrorProps) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 text-danger text-small bg-danger/10 p-3 rounded-lg mt-3" role="alert">
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
