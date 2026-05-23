export const MOBILE_BREAKPOINTS = {
  sm: 320,
  md: 360,
  lg: 390,
  xl: 414,
  tablet: 768,
} as const;

export const MOBILE_CONSTANTS = {
  MIN_TOUCH_TARGET: 44, // 44px minimum for touch accessibility
  BOTTOM_NAV_HEIGHT: 64, // Base height without safe area
  HEADER_HEIGHT: 56, // Base height without safe area
  FAB_SIZE: 56,
} as const;
