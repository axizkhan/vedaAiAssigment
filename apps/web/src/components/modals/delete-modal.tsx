"use client";

import * as React from "react";
import { ConfirmationModal } from "./confirmation-modal";

export interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void | Promise<void>;
  itemName: string;
  itemType?: string; // e.g., "assignment", "user"
}

export function DeleteModal({ isOpen, onClose, onDelete, itemName, itemType = "item" }: DeleteModalProps) {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onDelete}
      title={`Delete ${itemType}`}
      description={`Are you sure you want to delete "${itemName}"? This action cannot be undone and will permanently remove the ${itemType} from our servers.`}
      confirmLabel="Delete"
      isDanger
    />
  );
}
