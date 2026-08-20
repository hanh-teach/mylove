/**
 * Theme System Types
 * Supporting Enterprise Theme Modes: Light, Dark, High-Contrast, System
 */

export type ThemeMode = 'light' | 'dark' | 'high-contrast' | 'system';
export type ActiveTheme = 'light' | 'dark' | 'high-contrast';

export interface ThemeColorTokens {
  primary: string;
  primaryHover: string;
  primaryActive: string;

  surface: string;
  surfaceElevated: string;

  borderSubtle: string;
  borderBase: string;
  borderStrong: string;

  textMain: string;
  textMuted: string;
  textInverse: string;

  focusRing: string;
}

export interface ThemeTokens {
  mode: ActiveTheme;
  colors: ThemeColorTokens;
}

export interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  activeTheme: ActiveTheme;
  isDark: boolean;
  isHighContrast: boolean;
  tokens: ThemeColorTokens;
}
