// Animation durations (ms)
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 800
} as const;

// Easing functions (Framer Motion easing names)
export const ANIMATION_EASING = {
  easeOut: 'easeOut',
  easeInOut: 'easeInOut',
  circOut: 'circOut',
  circInOut: 'circInOut'
} as const;

// Stagger delays for list animations
export const ANIMATION_STAGGER = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15
} as const;

// Default transition config
export const DEFAULT_TRANSITION = {
  duration: ANIMATION_DURATION.normal / 1000,
  ease: ANIMATION_EASING.easeOut
} as const;

// Stage transition animation config
export const STAGE_TRANSITION = {
  duration: ANIMATION_DURATION.slow / 1000,
  ease: ANIMATION_EASING.circInOut
} as const;
