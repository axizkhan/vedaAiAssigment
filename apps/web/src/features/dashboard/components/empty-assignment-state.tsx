"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { PlusCircle, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EmptyAssignmentStateProps {
  onCreateClick?: () => void;
}

export function EmptyAssignmentState({ onCreateClick }: EmptyAssignmentStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-secondary/30 p-8 text-center md:p-12"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-accent shadow-soft-sm">
        <FilePlus className="h-10 w-10" />
      </div>
      
      <h3 className="text-h4 font-semibold text-foreground md:text-h3">
        No assignments yet
      </h3>
      
      <p className="mt-3 max-w-md text-small text-foreground-muted md:text-body">
        Create your first AI-generated assessment. You can customize questions, formats, and difficulty levels.
      </p>
      
      <div className="mt-8">
        <Button
          size="lg"
          onClick={onCreateClick}
          leftIcon={<PlusCircle className="h-5 w-5" />}
          className="shadow-soft-md"
        >
          Create Assignment
        </Button>
      </div>
    </motion.div>
  );
}
