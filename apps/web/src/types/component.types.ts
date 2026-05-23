export type ComponentSize = "sm" | "md" | "lg";

export type ComponentVariant = 
  | "primary" 
  | "secondary" 
  | "ghost" 
  | "danger" 
  | "outline" 
  | "icon";

export type FeedbackVariant = 
  | "success" 
  | "warning" 
  | "error" 
  | "info"
  | "default";

export interface BaseComponentProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export interface InteractiveComponentProps extends BaseComponentProps {
  onClick?: (event: React.MouseEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
  tabIndex?: number;
}
