import * as React from "react";
import { cn } from "@/lib/ui/component.utils";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-2", className)} {...props}>
      {children}
    </div>
  )
);
FormField.displayName = "FormField";

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, required, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-small font-medium text-foreground", className)}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-danger">*</span>}
    </label>
  )
);
FormLabel.displayName = "FormLabel";

export interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const FormError = React.forwardRef<HTMLParagraphElement, FormErrorProps>(
  ({ className, children, ...props }, ref) => {
    if (!children) return null;
    return (
      <p
        ref={ref}
        className={cn("text-caption text-danger", className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
FormError.displayName = "FormError";

export interface FormHelperProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const FormHelper = React.forwardRef<HTMLParagraphElement, FormHelperProps>(
  ({ className, children, ...props }, ref) => {
    if (!children) return null;
    return (
      <p
        ref={ref}
        className={cn("text-caption text-foreground-muted", className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
FormHelper.displayName = "FormHelper";
