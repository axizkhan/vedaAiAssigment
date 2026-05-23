"use client";

import * as React from "react";
import { AnimatePresence } from "framer-motion";
import { usePageTransition } from "@/hooks/use-page-transition";

export interface RouteTransitionProps {
  children: React.ReactNode;
}

export function RouteTransition({ children }: RouteTransitionProps) {
  const { pathnameKey } = usePageTransition();

  return (
    <AnimatePresence mode="wait">
      <React.Fragment key={pathnameKey}>
        {children}
      </React.Fragment>
    </AnimatePresence>
  );
}
