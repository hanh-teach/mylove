import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  applyThemeToDocument,
  resolveActiveTheme,
  getThemeTokens,
  THEME_STORAGE_KEY,
  type ThemeMode,
  type ActiveTheme,
  type ThemeContextType,
} from '../../shared/theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getSystemPrefersDark = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const readStoredMode = (): ThemeMode => {
  if (typeof localStorage === 'undefined') return 'light';
  const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
  if (saved === 'light' || saved === 'dark' || saved === 'high-contrast' || saved === 'system') {
    return saved;
  }
  return 'light';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize mode/activeTheme synchronously from localStorage + the OS preference so the
  // very first React render already matches what index.html's anti-flash script painted —
  // otherwise the UI would flash from the wrong theme to the right one on mount.
  const [mode, setModeState] = useState<ThemeMode>(readStoredMode);
  const [activeTheme, setActiveTheme] = useState<ActiveTheme>(() =>
    resolveActiveTheme(readStoredMode(), getSystemPrefersDark())
  );

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, mode);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      const next = resolveActiveTheme(mode, mediaQuery.matches);
      setActiveTheme(next);
      applyThemeToDocument(next);
    };

    updateTheme();

    // Only "system" mode needs to react live to OS-level changes; explicit
    // light/dark/high-contrast choices should stay put regardless of the OS.
    const handleChange = () => {
      if (mode === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
  }, []);

  const value = useMemo<ThemeContextType>(() => ({
    mode,
    setMode,
    activeTheme,
    isDark: activeTheme === 'dark' || activeTheme === 'high-contrast',
    isHighContrast: activeTheme === 'high-contrast',
    tokens: getThemeTokens(activeTheme),
  }), [mode, setMode, activeTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
