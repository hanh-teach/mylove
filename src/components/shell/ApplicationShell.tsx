import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNavigation } from '../layout/BottomNavigation';
import {
  Menu,
  X,
  Heart,
  Sparkles,
  Clock,
  Wand2,
  PenTool,
  Settings,
  Plus,
  HelpCircle,
  Folder,
  Layers,
  Image as ImageIcon,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Share2,
  Download,
  Info,
  Edit2,
  Copy,
  Archive,
  Trash2,
  Check,
  FolderPlus,
  Search,
  Bell
} from 'lucide-react';
import { WorkspaceProvider, useWorkspace } from './WorkspaceContext';
import { useProjectWorkspace } from '../../modules/workspace/WorkspaceContext';
import { NewProjectDialog } from '../workspace/NewProjectDialog';
import { FirstCardWizardModal } from '../card/FirstCardWizardModal';
import { AppHeader } from '../layout/AppHeader';
import { NavigationDrawer } from '../layout/NavigationDrawer';
import { Sidebar } from '../layout/Sidebar';
import { NotificationCenter } from './notifications/NotificationCenter';
import { useNotifications } from '../../modules/workspace/notifications/NotificationService';
import { NavigationConfig } from './NavigationConfig';

export type AppTabType = 'home' | 'card' | 'editor' | 'assets' | 'memory' | 'timeline' | 'aistudio' | 'design-system' | 'knowledge';

export interface NavigationItem {
  id: AppTabType | string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  category: 'Workspace' | 'AI' | 'Projects' | 'System';
  tabType?: AppTabType;
}

export interface NavigationSection {
  section: string;
  items: NavigationItem[];
}

interface ApplicationShellProps {
  activeTab: AppTabType;
  onSelectTab: (tab: AppTabType) => void;
  onOpenStudioEditor: () => void;
  onOpenNewMemory?: () => void;
  onOpenNewTimeline?: () => void;
  onOpenSettings?: () => void;
  onOpenSearch?: () => void;
  onGoHome?: () => void;
  children: React.ReactNode;
  projectStatus?: 'clean' | 'modified' | 'saving' | 'error';
  onManualSave?: () => void;
  sidebarOverride?: React.ReactNode;
}

const ShellContent: React.FC<ApplicationShellProps> = ({
  activeTab,
  onSelectTab,
  onOpenStudioEditor,
  onOpenNewMemory,
  onOpenNewTimeline,
  onOpenSettings,
  onOpenSearch,
  onGoHome,
  children,
  projectStatus,
  onManualSave,
  sidebarOverride
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [aboutModalOpen, setAboutModalOpen] = useState<boolean>(false);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState<boolean>(false);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState<boolean>(false);
  const [isCardWizardOpen, setIsCardWizardOpen] = useState<boolean>(false);
  const [isRenamingTitle, setIsRenamingTitle] = useState<boolean>(false);
  const [newTitleInput, setNewTitleInput] = useState<string>('');
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { breakpoint } = useWorkspace();
  const { unreadCount } = useNotifications();
  const {
    projects,
    activeProject,
    selectProject,
    renameProject,
    duplicateProject,
    archiveProject,
    trashProject,
  } = useProjectWorkspace();

  useEffect(() => {
    const handleTriggerNewProject = () => {
      setIsNewProjectDialogOpen(true);
    };
    window.addEventListener('trigger-new-project-dialog', handleTriggerNewProject);
    return () => window.removeEventListener('trigger-new-project-dialog', handleTriggerNewProject);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProjectDropdownOpen(false);
      }
    };
    if (isProjectDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProjectDropdownOpen]);

  const handleStartRename = () => {
    if (!activeProject) return;
    setNewTitleInput(activeProject.title);
    setIsRenamingTitle(true);
  };

  const handleSaveRename = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (activeProject && newTitleInput.trim() && newTitleInput !== activeProject.title) {
      renameProject(activeProject.id, newTitleInput.trim());
    }
    setIsRenamingTitle(false);
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-50 relative selection:bg-rose-500 selection:text-white pb-safe">
      {/* Sidebar for Desktop (≥ 1280px) */}
      <div className="hidden 2xl:flex w-[300px] shrink-0 border-r border-slate-200 bg-white">
        {sidebarOverride || <Sidebar activeTab={activeTab} onSelectTab={onSelectTab} />}
      </div>
      
      <div className="flex flex-col flex-1 w-full min-w-0">
        {/* 1. Top Bar Header */}
        <AppHeader
          title={activeProject ? `${activeProject.icon || '📁'} ${activeProject.title}` : "LoveNote Workspace"}
          isHome={activeTab === 'home'}
          onToggleMenu={() => setIsDrawerOpen(true)}
          onOpenQuickActions={() => setIsCardWizardOpen(true)}
          onOpenNotifications={() => setIsNotificationOpen(!isNotificationOpen)}
          onOpenSearch={onOpenSearch}
          onOpenSettings={onOpenSettings}
          onGoHome={onGoHome}
          activeProject={activeProject}
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          onRenameProject={renameProject}
          onDuplicateProject={duplicateProject}
          onArchiveProject={archiveProject}
          onTrashProject={trashProject}
          projectStatus={projectStatus}
          onManualSave={onManualSave}
        />

        {/* 2. Main Content Area */}
        <main className="flex-1 pt-14 pb-16 lg:pb-0 flex flex-col relative w-full overflow-hidden">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation (Only visible on Tablet/Mobile) */}
      {!sidebarOverride && (
        <div className="lg:hidden">
          <BottomNavigation activeTab={activeTab} onSelectTab={onSelectTab} />
        </div>
      )}

      {/* FSC-01 First Card Creation Wizard Modal */}
      <FirstCardWizardModal
        isOpen={isCardWizardOpen}
        onClose={() => setIsCardWizardOpen(false)}
        onNavigateHome={() => {
          setIsCardWizardOpen(false);
          onSelectTab('home');
        }}
        onOpenInStudioEditor={() => {
          setIsCardWizardOpen(false);
          onSelectTab('card');
        }}
      />

      {/* 3. Workspace Launcher Menu Drawer */}
      <NavigationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
         {sidebarOverride || <Sidebar activeTab={activeTab} onSelectTab={onSelectTab} />}
      </NavigationDrawer>

      {/* About Modal */}
      <AnimatePresence>
        {aboutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📁</span>
                  <h3 className="font-bold text-slate-900 text-sm">Sprint 58 — Multi-Document Workspace</h3>
                </div>
                <button
                  onClick={() => setAboutModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2 text-slate-600 leading-relaxed">
                <p>
                  <b>Sprint 58</b> nâng cấp nền tảng từ trình soạn thảo đơn thành hệ thống Workspace quản lý đa dự án thực tế:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><b>Tổ chức đa dạng:</b> Teacher Card, Birthday Card, Daily Journal, Graduation Speech, Family Album...</li>
                  <li><b>Quản lý dự án toàn diện:</b> Create, Rename, Duplicate, Archive, Soft Trash, Restore, Search, Sort & Favorites.</li>
                  <li><b>Ràng buộc ngữ cảnh:</b> Editor, Memory, Workflow, History & AI được tự động đồng bộ theo dự án hiện tại.</li>
                  <li><b>Giao diện responsive:</b> Tương thích hoàn toàn Windows (Sidebar), Android (Drawer & FAB), iOS (Native Action Sheet).</li>
                </ul>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setAboutModalOpen(false)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition-colors min-h-[40px]"
                >
                  Đã hiểu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Project Modal */}
      <NewProjectDialog
        isOpen={isNewProjectDialogOpen}
        onClose={() => setIsNewProjectDialogOpen(false)}
        onCreated={() => {
          onSelectTab('project-dashboard');
        }}
      />
    </div>
  );
};

export const ApplicationShell: React.FC<ApplicationShellProps> = (props) => {
  return (
    <WorkspaceProvider>
      <ShellContent {...props} />
    </WorkspaceProvider>
  );
};
