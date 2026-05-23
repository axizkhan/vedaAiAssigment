import { TargetAndTransition } from "framer-motion";
import { transitionPresets } from "./transition-presets";

/**
 * Standardized gesture variants mapping to our premium interaction rules.
 */
export const gesturePresets = {
  hoverCard: {
    scale: 1.01,
    y: -2,
    transition: transitionPresets.fast,
  } as TargetAndTransition,
  
  hoverButton: {
    scale: 1.02,
    transition: transitionPresets.fast,
  } as TargetAndTransition,

  tapButton: {
    scale: 0.97,
    transition: transitionPresets.fast,
  } as TargetAndTransition,
};
