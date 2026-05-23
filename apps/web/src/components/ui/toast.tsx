"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/ui/component.utils";
import type { FeedbackVariant } from "@/types/component.types";

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: FeedbackVariant;
  onClose: (id: string) => void;
  action?: React.ReactNode;
}

const variantConfig = {
  default: { icon: Info, className: "bg-surface border-border text-foreground" },
  success: { icon: CheckCircle, className: "bg-success text-white border-transparent" },
  error: { icon: XCircle, className: "bg-danger text-white border-transparent" },
  warning: { icon: AlertTriangle, className: "bg-warning text-white border-transparent" },
  info: { icon: Info, className: "bg-accent text-white border-transparent" },
};

export function Toast({ id, title, description, variant = "default", onClose, action }: ToastProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={cn(
        "pointer-events-auto flex w-full max-w-md items-start gap-4 rounded-lg border p-4 shadow-soft-lg",
        config.className
      )}
      role="alert"
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0 opacity-90" />
      <div className="flex-1">
        <h3 className="text-small font-semibold">{title}</h3>
        {description && <p className="mt-1 text-caption opacity-90">{description}</p>}
        {action && <div className="mt-3">{action}</div>}
      </div>
      <button
        onClick={() => onClose(id)}
        className="shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
