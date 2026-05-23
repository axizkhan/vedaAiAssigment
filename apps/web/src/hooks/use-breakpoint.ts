"use client";

import { useState, useEffect } from "react";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

export function useBreakpoint() {
  const [width, setWidth] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isAbove = (bp: Breakpoint) => mounted && width >= BREAKPOINTS[bp];
  const isBelow = (bp: Breakpoint) => mounted && width < BREAKPOINTS[bp];

  return {
    mounted,
    width,
    isMobile: isBelow("lg"),
    isTablet: isAbove("md") && isBelow("lg"),
    isDesktop: isAbove("lg"),
    isAbove,
    isBelow,
  };
}
