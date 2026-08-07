import { ThemeMode, ActiveTheme } from './types';
import { themeTokenMap } from './tokens';

export const THEME_STORAGE_KEY = 'lovenote-theme-mode';

export const resolveActiveTheme = (mode: ThemeMode, systemPrefersDark: boolean): ActiveTheme => {
  if (mode === 'system') {
    return systemPrefersDark ? 'dark' : 'light';
  }
  return mode;
};

export const applyThemeToDocument = (activeTheme: ActiveTheme): void => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Clear previous theme classes
  root.classList.remove('dark', 'high-contrast', 'light');

  if (activeTheme === 'dark') {
    root.classList.add('dark');
  } else if (activeTheme === 'high-contrast') {
    root.classList.add('dark', 'high-contrast');
  } else {
    root.classList.add('light');
  }

  // Set data attribute for CSS selectors and color-scheme for native UI elements
  root.setAttribute('data-theme', activeTheme);
  root.style.colorScheme = (activeTheme === 'dark' || activeTheme === 'high-contrast') ? 'dark' : 'light';

  // Dynamic <meta name="theme-color"> updates
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', (activeTheme === 'dark' || activeTheme === 'high-contrast') ? '#0f172a' : '#ffffff');
  }
};

export const getThemeTokens = (activeTheme: ActiveTheme) => {
  return themeTokenMap[activeTheme];
};
