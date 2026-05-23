import { SIDEBAR_WIDTH_EXPANDED, SIDEBAR_WIDTH_COLLAPSED } from "@/constants/navigation.constants";

export function getSidebarWidth(collapsed: boolean): number {
  return collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;
}

export function getContentMargin(collapsed: boolean, isDesktop: boolean): string {
  if (!isDesktop) return "0px";
  return `${getSidebarWidth(collapsed)}px`;
}
