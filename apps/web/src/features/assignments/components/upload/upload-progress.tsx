import * as React from "react";
import { motion } from "framer-motion";
import { formatFileSize } from "../../utils/upload.utils";
import { FileIcon, Loader2 } from "lucide-react";

export interface UploadProgressProps {
  file: File;
  progress: number;
}

export function UploadProgress({ file, progress }: UploadProgressProps) {
  return (
    <div className="w-full p-4 border rounded-xl border-border bg-surface-muted overflow-hidden relative">
      <div className="flex items-center space-x-4 relative z-10">
        <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
          <FileIcon className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-small font-medium text-foreground truncate">
            {file.name}
          </p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-small-muted">{formatFileSize(file.size)}</p>
            <p className="text-small-muted font-medium">{Math.round(progress)}%</p>
          </div>
        </div>

        <div className="shrink-0 text-primary">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ ease: "linear", duration: 0.2 }}
      />
    </div>
  );
}
