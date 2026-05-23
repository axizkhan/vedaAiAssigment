"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";

export function PageTransitionLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = React.useState(false);

  React.useEffect(() => {
    // Hide loader when route finishes changing
    setIsNavigating(false);
  }, [pathname, searchParams]);

  // A real implementation would hook into next/router events or a custom link component
  // to trigger setIsNavigating(true) when a transition starts.
  // We provide the UI structure here for the overlay.
  
  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="fixed inset-0 z-50 pointer-events-none bg-background/20 backdrop-blur-sm flex items-start"
        >
          {/* Top progress bar */}
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "80%" }}
            transition={{ duration: 5, ease: "easeOut" }}
            className="h-1 bg-primary"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
