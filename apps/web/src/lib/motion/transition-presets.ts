export const TRANSITIONS = {
  // Durations
  FAST: 0.15,
  NORMAL: 0.25,
  SLOW: 0.4,
  PAGE: 0.35,

  // Easings (mapping to CSS variables)
  EASE_STANDARD: [0.4, 0.0, 0.2, 1],
  EASE_DECELERATE: [0.0, 0.0, 0.2, 1],
  EASE_ACCELERATE: [0.4, 0.0, 1, 1],
  EASE_BOUNCE_SOFT: [0.34, 1.56, 0.64, 1],
};

export const transitionPresets = {
  standard: {
    duration: TRANSITIONS.NORMAL,
    ease: TRANSITIONS.EASE_STANDARD,
  },
  fast: {
    duration: TRANSITIONS.FAST,
    ease: TRANSITIONS.EASE_DECELERATE,
  },
  slow: {
    duration: TRANSITIONS.SLOW,
    ease: TRANSITIONS.EASE_STANDARD,
  },
  spring: {
    type: "spring",
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  },
  springSoft: {
    type: "spring",
    stiffness: 300,
    damping: 35,
    mass: 1,
  },
  page: {
    duration: TRANSITIONS.PAGE,
    ease: TRANSITIONS.EASE_DECELERATE,
  }
};
