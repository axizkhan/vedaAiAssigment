import { usePathname } from "next/navigation";

/**
 * Hook for driving page transitions based on Next.js route changes.
 * Can be used as a key in AnimatePresence to trigger exit/enter animations.
 */
export function usePageTransition() {
  const pathname = usePathname();
  
  return {
    pathnameKey: pathname,
  };
}
