"use client";

import { MoreVertical, Edit2, Copy, Trash2, Eye } from "lucide-react";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";

export interface AssignmentActionsDropdownProps {
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onPreview?: () => void;
  trigger?: React.ReactNode;
}

export function AssignmentActionsDropdown({
  onEdit,
  onDuplicate,
  onDelete,
  onPreview,
  trigger,
}: AssignmentActionsDropdownProps) {
  return (
    <Dropdown
      trigger={
        trigger || (
          <Button variant="ghost" size="icon" aria-label="Actions">
            <MoreVertical className="h-4 w-4" />
          </Button>
        )
      }
      align="right"
      width="w-48"
    >
      <div className="py-1">
        {onPreview && (
          <DropdownItem onClick={onPreview}>
            <Eye className="w-4 h-4 mr-2" /> Preview
          </DropdownItem>
        )}
        {onEdit && (
          <DropdownItem onClick={onEdit}>
            <Edit2 className="w-4 h-4 mr-2" /> Edit
          </DropdownItem>
        )}
        {onDuplicate && (
          <DropdownItem onClick={onDuplicate}>
            <Copy className="w-4 h-4 mr-2" /> Duplicate
          </DropdownItem>
        )}
        {onDelete && (
          <DropdownItem onClick={onDelete} danger>
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </DropdownItem>
        )}
      </div>
    </Dropdown>
  );
}
