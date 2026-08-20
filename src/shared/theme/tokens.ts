import { ThemeColorTokens, ActiveTheme } from './types';

export const lightThemeTokens: ThemeColorTokens = {
  primary: 'var(--color-rose-600)',
  primaryHover: 'var(--color-rose-700)',
  primaryActive: 'var(--color-rose-800)',

  surface: '#ffffff',
  surfaceElevated: '#f8fafc',

  borderSubtle: '#f1f5f9',
  borderBase: '#e2e8f0',
  borderStrong: '#cbd5e1',

  textMain: '#0f172a',
  textMuted: '#64748b',
  textInverse: '#ffffff',

  focusRing: '#e11d48',
};

export const darkThemeTokens: ThemeColorTokens = {
  primary: 'var(--color-rose-500)',
  primaryHover: 'var(--color-rose-600)',
  primaryActive: 'var(--color-rose-700)',

  surface: '#0f172a',
  surfaceElevated: '#1e293b',

  borderSubtle: '#1e293b',
  borderBase: '#334155',
  borderStrong: '#475569',

  textMain: '#f8fafc',
  textMuted: '#94a3b8',
  textInverse: '#0f172a',

  focusRing: '#f43f5e',
};

export const highContrastThemeTokens: ThemeColorTokens = {
  primary: '#f43f5e',
  primaryHover: '#e11d48',
  primaryActive: '#be123c',

  surface: '#000000',
  surfaceElevated: '#121212',

  borderSubtle: '#333333',
  borderBase: '#ffffff',
  borderStrong: '#ffff00',

  textMain: '#ffffff',
  textMuted: '#ffff00',
  textInverse: '#000000',

  focusRing: '#ffff00',
};

export const themeTokenMap: Record<ActiveTheme, ThemeColorTokens> = {
  light: lightThemeTokens,
  dark: darkThemeTokens,
  'high-contrast': highContrastThemeTokens,
};
