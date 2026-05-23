import { useState, useCallback } from "react";
import { useReducedMotion } from "./use-reduced-motion";

/**
 * Lightweight hook to manage hover state for custom JS-driven animations
 * when pure CSS hover isn't enough.
 */
export function useHoverAnimation() {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReduced = useReducedMotion();

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const hoverProps = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onTouchStart: handleMouseEnter, // mobile touch feedback
    onTouchEnd: handleMouseLeave,
    onTouchCancel: handleMouseLeave,
  };

  return {
    isHovered,
    // Provide a safe scale value that respects reduced motion
    hoverScale: prefersReduced ? 1 : (isHovered ? 1.01 : 1),
    hoverProps,
  };
}
