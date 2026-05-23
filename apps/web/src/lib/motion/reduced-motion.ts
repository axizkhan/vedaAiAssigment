import { Variants } from "framer-motion";

/**
 * Returns a variant object that strips out heavy transforms 
 * if reduced motion is preferred.
 */
export function createReducedMotionVariants(
  variants: Variants, 
  shouldReduceMotion: boolean
): Variants {
  if (!shouldReduceMotion) return variants;

  const reduced: Variants = {};
  
  for (const key in variants) {
    if (Object.prototype.hasOwnProperty.call(variants, key)) {
      const original = variants[key];
      if (typeof original === "object" && original !== null) {
        // Only keep opacity, strip x, y, scale, rotate
        const { x, y, scale, rotate, ...rest } = original as any;
        
        // Also speed up transitions
        let transition = rest.transition;
        if (transition) {
          transition = { ...transition, duration: 0.01, delay: 0 };
        }
        
        reduced[key] = {
          ...rest,
          transition
        };
      } else {
        reduced[key] = original;
      }
    }
  }
  
  return reduced;
}
