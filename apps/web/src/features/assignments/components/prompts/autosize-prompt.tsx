"use client";

import * as React from "react";
import { cn } from "@/lib/ui/component.utils";

export interface AutosizePromptProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const AutosizePrompt = React.forwardRef<HTMLTextAreaElement, AutosizePromptProps>(
  ({ className, error, onChange, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement | null>(null);

    const resize = React.useCallback(() => {
      const el = internalRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, []);

    React.useEffect(() => {
      resize();
    }, [props.value, resize]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      resize();
      onChange?.(e);
    };

    return (
      <textarea
        ref={(node) => {
          internalRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          "flex w-full rounded-md border bg-transparent px-3 py-3 text-small resize-none overflow-hidden transition-all",
          "placeholder:text-foreground-muted",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-danger focus-visible:ring-danger" : "border-border",
          className
        )}
        onChange={handleChange}
        rows={4}
        {...props}
      />
    );
  }
);
AutosizePrompt.displayName = "AutosizePrompt";
