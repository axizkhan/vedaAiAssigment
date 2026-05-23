import type { Variants } from "framer-motion";
import { UI_CONSTANTS } from "@/constants/ui.constants";

export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: UI_CONSTANTS.ANIMATION_DURATION.FAST } },
  exit: { opacity: 0, transition: { duration: UI_CONSTANTS.ANIMATION_DURATION.FAST } },
};

export const slideUpVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: UI_CONSTANTS.ANIMATION_DURATION.NORMAL } },
  exit: { opacity: 0, y: 12, transition: { duration: UI_CONSTANTS.ANIMATION_DURATION.FAST } },
};

export const scaleVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: UI_CONSTANTS.ANIMATION_DURATION.NORMAL } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: UI_CONSTANTS.ANIMATION_DURATION.FAST } },
};
