import { Variants } from "framer-motion";
import { transitionPresets } from "./transition-presets";

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: transitionPresets.standard 
  },
  exit: { 
    opacity: 0,
    transition: transitionPresets.fast 
  }
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitionPresets.standard
  },
  exit: { 
    opacity: 0, 
    y: -8,
    transition: transitionPresets.fast
  }
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: transitionPresets.springSoft
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: transitionPresets.fast
  }
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1
    }
  }
};
