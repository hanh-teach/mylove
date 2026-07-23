import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from '../Header/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { NavigationDrawer } from '../../components/layout/NavigationDrawer';
import { StatusBar } from '../StatusBar/StatusBar';
import { BottomNavigation } from '../../components/layout/BottomNavigation';
import { NotificationCenter } from '../Notifications/NotificationCenter';
import { DeveloperDiagnosticPanel } from '../Overlay/DeveloperDiagnosticPanel';
import { AssetsLibraryPanel } from '../../components/asset/AssetsLibraryPanel';
import { NewProjectDialog } from '../../components/workspace/NewProjectDialog';
import { AppTabType } from '../../types';
import { useNotifications } from '../../modules/workspace/notifications/NotificationService';

interface AppShellProps {
  activeTab: AppTabType;
  onSelectTab: (tab: AppTabType) => void;
  activeProject?: any;
  children: React.ReactNode;
  sidebarOverride?: React.ReactNode;
}

export const ApplicationShell: React.FC<AppShellProps> = ({
  activeTab,
  onSelectTab,
  activeProject,
  children,
  sidebarOverride
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [isAssetsPanelOpen, setIsAssetsPanelOpen] = useState(false);
  const { unreadCount } = useNotifications();

  // Handle shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Assets Panel with 'A'
      if (e.key.toLowerCase() === 'a' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        setIsAssetsPanelOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectTab = (tab: AppTabType) => {
    if (tab === 'assets') {
      setIsAssetsPanelOpen(true);
      return;
    }
    onSelectTab(tab);
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-slate-50 relative selection:bg-rose-500 selection:text-white pb-safe overflow-hidden">
      {/* Top Header */}
      <Header 
        title="LoveNote Workspace"
        onToggleMenu={() => setIsDrawerOpen(true)}
        onOpenNotifications={() => setIsNotificationOpen(!isNotificationOpen)}
        onOpenQuickActions={() => setIsNewProjectDialogOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden pt-14 lg:pt-[72px]">
        {/* Sidebar for Desktop (Narrow 64px - Sprint 75.9 / Image 2) */}
        <aside className={`hidden 2xl:flex shrink-0 border-r border-border-subtle bg-white overflow-y-auto overflow-x-hidden ${sidebarOverride ? 'w-64' : 'w-16'}`}>
          {sidebarOverride || (
            <Sidebar 
              activeTab={activeTab} 
              onSelectTab={handleSelectTab} 
              isAssetsPanelOpen={isAssetsPanelOpen} 
            />
          )}
        </aside>

        {/* Main Workspace Area */}
        <main className="flex-1 flex flex-col min-w-0 relative bg-slate-50 overflow-hidden">
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
            {children}
          </div>
          
          {/* Desktop Status Bar */}
          <StatusBar />
        </main>

        {/* Context Panel Placeholder (Sprint 75.9 requirement) */}
        <div className="hidden 3xl:flex w-80 border-l border-border-subtle bg-white shrink-0">
          <div className="p-4">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Context Panel</p>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <BottomNavigation 
        activeTab={activeTab} 
        onSelectTab={handleSelectTab} 
        isAssetsPanelOpen={isAssetsPanelOpen} 
      />

      {/* Overlays */}
      <NavigationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        {sidebarOverride || (
          <Sidebar 
            activeTab={activeTab} 
            onSelectTab={handleSelectTab} 
            isDrawer 
            isAssetsPanelOpen={isAssetsPanelOpen} 
          />
        )}
      </NavigationDrawer>

      <AnimatePresence>
        {isNotificationOpen && (
          <div className="fixed top-14 lg:top-[72px] right-4 z-50">
            <NotificationCenter isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
          </div>
        )}
      </AnimatePresence>

      <AssetsLibraryPanel 
        isOpen={isAssetsPanelOpen} 
        onClose={() => setIsAssetsPanelOpen(false)} 
      />

      <NewProjectDialog 
        isOpen={isNewProjectDialogOpen} 
        onClose={() => setIsNewProjectDialogOpen(false)} 
      />

      {/* Developer Mode UI */}
      <DeveloperDiagnosticPanel />
    </div>
  );
};
