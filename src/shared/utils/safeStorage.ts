/**
 * Safe storage utility for cross-platform resilience (Android Chrome, Incognito, WebViews, Safari Private, iframes)
 * Prevents SecurityError / DOMException when third-party cookies or storage are restricted.
 */

const memorySessionStore: Record<string, string> = {};
const memoryLocalStore: Record<string, string> = {};

export const safeSessionStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        return window.sessionStorage.getItem(key);
      }
    } catch {
      // Fallback to in-memory store
    }
    return memorySessionStore[key] ?? null;
  },

  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(key, value);
        return;
      }
    } catch {
      // Fallback to in-memory store
    }
    memorySessionStore[key] = value;
  },

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(key);
        return;
      }
    } catch {
      // Fallback to in-memory store
    }
    delete memorySessionStore[key];
  },
};

export const safeLocalStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Fallback to in-memory store
    }
    return memoryLocalStore[key] ?? null;
  },

  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch {
      // Fallback to in-memory store
    }
    memoryLocalStore[key] = value;
  },

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch {
      // Fallback to in-memory store
    }
    delete memoryLocalStore[key];
  },
};

export const safeStorage = {
  session: safeSessionStorage,
  local: safeLocalStorage,
};

export default safeStorage;

