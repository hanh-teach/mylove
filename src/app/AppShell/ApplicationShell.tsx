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
import { AuthModal } from '../../components/auth/AuthModal';
import { AppTabType } from '../../types';
import { useNotifications } from '../../modules/workspace/notifications/NotificationService';

interface AppShellProps {
  activeTab: AppTabType;
  onSelectTab: (tab: AppTabType) => void;
  activeProject?: any;
  children: React.ReactNode;
  sidebarOverride?: React.ReactNode;
  onOpenStudioEditor?: () => void;
  onOpenSettings?: () => void;

  // Customization controls
  showSettingsMenu?: boolean;
  onToggleSettingsMenu?: () => void;
  bgStyle?: string;
  cycleBgStyle?: () => void;
  fontStyle?: string;
  cycleFont?: () => void;
  currentMusic?: any;
  musicTracks?: any[];
  setCurrentMusic?: (track: any) => void;
  showMusicMenu?: boolean;
  setShowMusicMenu?: (show: boolean) => void;
  textColor?: string;
  textColors?: any[];
  setTextColor?: (color: string) => void;
  showTextColorMenu?: boolean;
  setShowTextColorMenu?: (show: boolean) => void;
  textSize?: number;
  setTextSize?: (size: any) => void;
  showTextSizeMenu?: boolean;
  setShowTextSizeMenu?: (show: boolean) => void;
  showPalette?: boolean;
  setShowPalette?: (show: boolean) => void;
  isEditing?: boolean;
  setIsEditing?: (editing: boolean) => void;
  generateVideo?: () => void;
  updateActiveProjectContent?: (data: any) => void;
}

export const ApplicationShell: React.FC<AppShellProps> = ({
  activeTab,
  onSelectTab,
  activeProject,
  children,
  sidebarOverride,
  onOpenStudioEditor,
  onOpenSettings,
  showSettingsMenu,
  onToggleSettingsMenu,
  bgStyle,
  cycleBgStyle,
  fontStyle,
  cycleFont,
  currentMusic,
  musicTracks,
  setCurrentMusic,
  showMusicMenu,
  setShowMusicMenu,
  textColor,
  textColors,
  setTextColor,
  showTextColorMenu,
  setShowTextColorMenu,
  textSize,
  setTextSize,
  showTextSizeMenu,
  setShowTextSizeMenu,
  showPalette,
  setShowPalette,
  isEditing,
  setIsEditing,
  generateVideo,
  updateActiveProjectContent
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [isAssetsPanelOpen, setIsAssetsPanelOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { unreadCount } = useNotifications();

  // Handle shortcuts & custom events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Assets Panel with 'A'
      if (e.key.toLowerCase() === 'a' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        setIsAssetsPanelOpen(prev => !prev);
      }
    };

    const handleOpenAuthEvent = () => {
      setIsAuthModalOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-auth-modal', handleOpenAuthEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-auth-modal', handleOpenAuthEvent);
    };
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
        title="NoteMe Workspace"
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onToggleMenu={() => setIsDrawerOpen(true)}
        onOpenNotifications={() => setIsNotificationOpen(!isNotificationOpen)}
        onOpenQuickActions={() => setIsNewProjectDialogOpen(true)}
        onGoHome={() => handleSelectTab('card')}
        onOpenStudioEditor={onOpenStudioEditor}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        showSettingsMenu={showSettingsMenu}
        onToggleSettingsMenu={onToggleSettingsMenu}
        bgStyle={bgStyle}
        cycleBgStyle={cycleBgStyle}
        fontStyle={fontStyle}
        cycleFont={cycleFont}
        currentMusic={currentMusic}
        musicTracks={musicTracks}
        setCurrentMusic={setCurrentMusic}
        showMusicMenu={showMusicMenu}
        setShowMusicMenu={setShowMusicMenu}
        textColor={textColor}
        textColors={textColors}
        setTextColor={setTextColor}
        showTextColorMenu={showTextColorMenu}
        setShowTextColorMenu={setShowTextColorMenu}
        textSize={textSize}
        setTextSize={setTextSize}
        showTextSizeMenu={showTextSizeMenu}
        setShowTextSizeMenu={setShowTextSizeMenu}
        showPalette={showPalette}
        setShowPalette={setShowPalette}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        generateVideo={generateVideo}
        updateActiveProjectContent={updateActiveProjectContent}
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
        onCreateNew={() => setIsNewProjectDialogOpen(true)}
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

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Developer Mode UI */}
      <DeveloperDiagnosticPanel />
    </div>
  );
};
