import type { NavigationItem } from "@/types/layout.types";

export function isNavItemActive(item: NavigationItem, pathname: string): boolean {
  if (pathname === item.href) return true;
  if (item.href !== "/" && pathname.startsWith(item.href)) return true;
  return false;
}
