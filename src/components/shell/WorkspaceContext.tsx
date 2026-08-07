import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'laptop' | 'desktop';

interface WorkspaceContextType {
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isLaptop: boolean;
  isDesktop: boolean;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  isInspectorOpen: boolean;
  setInspectorOpen: (open: boolean) => void;
  toggleInspector: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isFocusMode: boolean;
  toggleFocusMode: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [isInspectorOpen, setInspectorOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Breakpoints: Mobile < 768, Tablet 768-1023, Laptop 1024-1439, Desktop >= 1440
  const breakpoint: Breakpoint = 
    windowWidth < 768 ? 'mobile' :
    windowWidth < 1024 ? 'tablet' :
    windowWidth < 1440 ? 'laptop' : 'desktop';

  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';
  const isLaptop = breakpoint === 'laptop';
  const isDesktop = breakpoint === 'desktop';

  // Auto-collapse sidebar/inspector on mobile/tablet default
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
      setInspectorOpen(false);
    } else if (isTablet) {
      setSidebarOpen(false);
    }
  }, [breakpoint]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleInspector = () => setInspectorOpen((prev) => !prev);
  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);
  const toggleFocusMode = () => setIsFocusMode((prev) => !prev);

  return (
    <WorkspaceContext.Provider
      value={{
        breakpoint,
        isMobile,
        isTablet,
        isLaptop,
        isDesktop,
        isSidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        isInspectorOpen,
        setInspectorOpen,
        toggleInspector,
        isFullscreen,
        toggleFullscreen,
        isFocusMode,
        toggleFocusMode,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
