import {
  LayoutDashboard,
  FileText,
  Library,
  Sparkles,
  Settings,
} from "lucide-react";
import type { NavigationItem } from "@/types/layout.types";

export const SIDEBAR_NAV_ITEMS: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "assignments",
    label: "Assignments",
    href: "/assignments",
    icon: FileText,
  },
  {
    id: "library",
    label: "Library",
    href: "/library",
    icon: Library,
  },
  {
    id: "toolkit",
    label: "AI Toolkit",
    href: "/toolkit",
    icon: Sparkles,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export const MOBILE_NAV_ITEMS: NavigationItem[] = [
  SIDEBAR_NAV_ITEMS[0], // Dashboard
  SIDEBAR_NAV_ITEMS[1], // Assignments
  SIDEBAR_NAV_ITEMS[2], // Library
  SIDEBAR_NAV_ITEMS[3], // AI Toolkit
];

export const SIDEBAR_WIDTH_EXPANDED = 260;
export const SIDEBAR_WIDTH_COLLAPSED = 72;
