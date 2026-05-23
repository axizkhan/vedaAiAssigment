import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/**
 * Hook to determine if the user has requested reduced motion.
 * Returns true if prefers-reduced-motion is enabled.
 */
export function useReducedMotion() {
  const prefersReduced = useFramerReducedMotion();
  // Ensure a boolean is returned (framer-motion returns boolean | null on server)
  return !!prefersReduced;
}
