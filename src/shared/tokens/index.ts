/**
 * Design System Tokens
 * Enterprise Standard Design Tokens for LoveNote Architecture
 */

export const colors = {
  primary: 'var(--color-primary)',
  primaryHover: 'var(--color-primary-hover)',
  primaryActive: 'var(--color-primary-active)',

  surface: 'var(--color-surface)',
  surfaceElevated: 'var(--color-surface-elevated)',

  borderSubtle: 'var(--color-border-subtle)',
  borderBase: 'var(--color-border-base)',
  borderStrong: 'var(--color-border-strong)',

  textMain: 'var(--color-text-main)',
  textMuted: 'var(--color-text-muted)',
  textInverse: 'var(--color-text-inverse)',
} as const;

export const spacing = {
  '3xs': '2px',
  '2xs': '4px',
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  safeTop: 'env(safe-area-inset-top)',
  safeBottom: 'env(safe-area-inset-bottom)',
} as const;

export const radius = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  full: '9999px',
} as const;

export const shadow = {
  level0: 'none',
  level1: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  level2: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  level3: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
} as const;

export const typography = {
  fontFamily: {
    sans: 'var(--font-sans)',
    dancing: 'var(--font-dancing)',
    pacifico: 'var(--font-pacifico)',
    caveat: 'var(--font-caveat)',
    lora: 'var(--font-lora)',
    nunito: 'var(--font-nunito)',
    playfair: 'var(--font-playfair)',
  },
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  dock: 10,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;

export const animation = {
  duration: {
    fast: '180ms',
    base: '250ms',
    slow: '400ms',
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  },
} as const;

export const designTokens = {
  colors,
  spacing,
  radius,
  shadow,
  typography,
  zIndex,
  animation,
} as const;

export default designTokens;
