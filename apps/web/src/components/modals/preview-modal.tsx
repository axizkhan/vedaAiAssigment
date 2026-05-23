"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";

export interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pdfUrl?: string;
  onDownload?: () => void;
}

export function PreviewModal({ isOpen, onClose, title, pdfUrl, onDownload }: PreviewModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className="max-w-4xl w-full h-[90vh] flex flex-col"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          {onDownload && (
            <Button variant="outline" onClick={onDownload} leftIcon={<Download className="w-4 h-4" />}>
              Download
            </Button>
          )}
          {pdfUrl && (
            <Button
              variant="primary"
              onClick={() => window.open(pdfUrl, "_blank")}
              leftIcon={<ExternalLink className="w-4 h-4" />}
            >
              Open in new tab
            </Button>
          )}
        </>
      }
    >
      <div className="flex-1 w-full h-[70vh] bg-surface-secondary rounded-md overflow-hidden flex items-center justify-center">
        {pdfUrl ? (
          <iframe src={pdfUrl} className="w-full h-full border-0" title={title} />
        ) : (
          <p className="text-foreground-muted text-small">Preview not available</p>
        )}
      </div>
    </Modal>
  );
}
