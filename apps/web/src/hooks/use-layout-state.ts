"use client";

import { useBreakpoint } from "./use-breakpoint";
import { useSidebar } from "./use-sidebar";
import { useMobileNav } from "./use-mobile-nav";

export function useLayoutState() {
  const breakpoint = useBreakpoint();
  const sidebar = useSidebar();
  const mobileNav = useMobileNav();

  return {
    ...breakpoint,
    ...sidebar,
    ...mobileNav,
  };
}
