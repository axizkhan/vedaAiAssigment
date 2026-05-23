import { useState, useCallback } from "react";
import { useReducedMotion } from "./use-reduced-motion";

/**
 * Hook for driving premium touch/press gesture feedback.
 */
export function useGestureFeedback() {
  const [isPressed, setIsPressed] = useState(false);
  const prefersReduced = useReducedMotion();

  const handlePressStart = useCallback(() => setIsPressed(true), []);
  const handlePressEnd = useCallback(() => setIsPressed(false), []);

  const gestureProps = {
    onPointerDown: handlePressStart,
    onPointerUp: handlePressEnd,
    onPointerLeave: handlePressEnd,
    onPointerCancel: handlePressEnd,
  };

  return {
    isPressed,
    // Provide a safe press scale
    pressScale: prefersReduced ? 1 : (isPressed ? 0.97 : 1),
    gestureProps,
  };
}
