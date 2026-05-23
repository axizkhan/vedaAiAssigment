import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        secondary:
          "bg-surface-secondary text-foreground shadow-sm hover:bg-surface-secondary/80 border border-border",
        danger:
          "bg-danger text-white shadow-sm hover:bg-danger/90",
        outline:
          "border border-border bg-transparent hover:bg-surface-secondary text-foreground",
        ghost: "hover:bg-surface-secondary hover:text-foreground text-foreground-muted",
        icon: "hover:bg-surface-secondary text-foreground-muted hover:text-foreground rounded-full",
      },
      size: {
        sm: "h-8 px-3 text-caption",
        md: "h-10 px-4 py-2 text-small",
        lg: "h-12 px-8 text-body",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-caption font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-surface-secondary text-foreground hover:bg-surface-secondary/80",
        danger:
          "border-transparent bg-danger text-white shadow hover:bg-danger/80",
        outline: "text-foreground border-border",
        success: "border-transparent bg-success text-white shadow hover:bg-success/80",
        warning: "border-transparent bg-warning text-white shadow hover:bg-warning/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
