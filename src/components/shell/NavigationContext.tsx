import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AppTabType } from './ApplicationShell';
import { NavigationRegistry, ScreenDefinition } from './NavigationRegistry';

interface NavigationContextType {
  currentScreen: AppTabType | string;
  navigate: (screenId: AppTabType | string) => void;
  goBack: () => void;
  history: string[];
  previousScreen: string | null;
  breadcrumbs: ScreenDefinition[];
  modalStack: string[];
  pushModal: (modalId: string) => void;
  popModal: () => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'lovenote_last_screen_v4';

export const NavigationProvider: React.FC<{
  initialScreen?: AppTabType | string;
  onScreenChange?: (screen: AppTabType | string) => void;
  children: ReactNode;
}> = ({ initialScreen = 'card', onScreenChange, children }) => {
  // Resume last workspace from localStorage if available
  const [currentScreen, setCurrentScreen] = useState<AppTabType | string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved && NavigationRegistry.resolve(saved)) {
        return saved;
      }
    }
    return initialScreen;
  });

  const [history, setHistory] = useState<string[]>([currentScreen]);
  const [modalStack, setModalStack] = useState<string[]>([]);
  const [isSearchOpen, setSearchOpen] = useState<boolean>(false);

  const navigate = useCallback((screenId: AppTabType | string) => {
    const def = NavigationRegistry.resolve(screenId);
    if (!def) return;

    setCurrentScreen((prev) => {
      if (prev === screenId) return prev;
      setHistory((h) => [...h, screenId]);
      return screenId;
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, screenId);
    }

    if (onScreenChange) {
      onScreenChange(screenId);
    }
  }, [onScreenChange]);

  const goBack = useCallback(() => {
    if (history.length <= 1) return;
    setHistory((h) => {
      const newH = [...h];
      newH.pop(); // remove current
      const prev = newH[newH.length - 1] || 'card';
      setCurrentScreen(prev);
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, prev);
      }
      if (onScreenChange) {
        onScreenChange(prev);
      }
      return newH;
    });
  }, [history, onScreenChange]);

  const pushModal = useCallback((modalId: string) => {
    setModalStack((prev) => [...prev, modalId]);
  }, []);

  const popModal = useCallback(() => {
    setModalStack((prev) => {
      const copy = [...prev];
      copy.pop();
      return copy;
    });
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        if (e.key === '1') {
          e.preventDefault();
          navigate('card');
        } else if (e.key === '2') {
          e.preventDefault();
          navigate('editor');
        } else if (e.key === '3') {
          e.preventDefault();
          navigate('timeline');
        } else if (e.key === '4') {
          e.preventDefault();
          navigate('memory');
        } else if (e.key === 'k' || e.key === 'K') {
          e.preventDefault();
          setSearchOpen((prev) => !prev);
        }
      }

      if (e.key === 'Escape') {
        if (modalStack.length > 0) {
          popModal();
        } else if (isSearchOpen) {
          setSearchOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, modalStack, isSearchOpen, popModal]);

  const previousScreen = history.length > 1 ? history[history.length - 2] : null;

  // Build breadcrumbs based on history or hierarchy
  const breadcrumbs: ScreenDefinition[] = history.slice(-3).map((id) => {
    return NavigationRegistry.resolve(id) || { id, title: id, icon: null, category: 'Workspace' };
  });

  return (
    <NavigationContext.Provider
      value={{
        currentScreen,
        navigate,
        goBack,
        history,
        previousScreen,
        breadcrumbs,
        modalStack,
        pushModal,
        popModal,
        isSearchOpen,
        setSearchOpen,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
