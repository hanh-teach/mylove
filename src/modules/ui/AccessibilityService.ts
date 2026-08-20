import React from 'react';

export const AccessibilityService = {
  setLargeText: (enabled: boolean) => {},
  setHighContrast: (enabled: boolean) => {},
};

export const ShortcutService = {
  register: (shortcut: string, action: () => void) => {},
};

export const DialogService = {
  open: (title: string, content: React.ReactNode) => {},
};

export const FocusService = {
  focus: (elementId: string) => {},
};
