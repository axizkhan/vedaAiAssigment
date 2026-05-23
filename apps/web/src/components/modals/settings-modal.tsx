"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  onSave?: () => void | Promise<void>;
  title?: string;
  isSaving?: boolean;
}

export function SettingsModal({ isOpen, onClose, children, onSave, title = "Settings", isSaving = false }: SettingsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className="max-w-2xl w-full"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          {onSave && (
            <Button variant="primary" onClick={onSave} loading={isSaving}>
              Save Changes
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6">
        {children}
      </div>
    </Modal>
  );
}
