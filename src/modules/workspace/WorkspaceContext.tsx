import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Project, ProjectTemplate } from './Project';
import { projectService } from './ProjectService';
import { SortField, SortDirection } from './ProjectSorter';
import { useToast } from '../../components/common/Toast';

export type WorkspaceViewType = 'projects' | 'favorites' | 'recent' | 'archive' | 'trash';

interface WorkspaceContextType {
  // ... existing props
  projects: Project[];
  activeProject: Project | null;
  activeView: WorkspaceViewType;
  setActiveView: (view: WorkspaceViewType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: SortField;
  setSortBy: (field: SortField) => void;
  sortDirection: SortDirection;
  setSortDirection: (direction: SortDirection) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  filteredProjects: Project[];
  
  selectProject: (id: string) => void;
  createProject: (
    title: string,
    template?: ProjectTemplate,
    category?: string,
    themeColor?: string,
    icon?: string,
    description?: string
  ) => Project;
  renameProject: (id: string, newTitle: string) => void;
  duplicateProject: (id: string) => Project | null;
  archiveProject: (id: string) => void;
  unarchiveProject: (id: string) => void;
  trashProject: (id: string) => void;
  restoreProject: (id: string) => void;
  permanentlyDeleteProject: (id: string) => void;
  emptyTrash: () => void;
  toggleFavorite: (id: string) => void;
  updateActiveProjectContent: (updates: Partial<Project['content']>) => void;
  updateActiveProject: (updates: Partial<Project>) => void;
  logActivity: (id: string, type: Project['recentActivity'][0]['type'], description: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const ProjectWorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => projectService.getProjects());
  const [activeProject, setActiveProject] = useState<Project | null>(() => projectService.getActiveProject() || null);
  const [activeView, setActiveView] = useState<WorkspaceViewType>('projects');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { showToast } = useToast();

  const reloadData = useCallback(() => {
    setProjects([...projectService.getProjects()]);
    setActiveProject(projectService.getActiveProject() || null);
  }, []);

  useEffect(() => {
    const unsubscribe = projectService.subscribe(() => {
      reloadData();
    });
    return unsubscribe;
  }, [reloadData]);

  const selectProject = useCallback((id: string) => {
    projectService.setActiveProject(id);
    reloadData();
  }, [reloadData]);

  const createProject = useCallback((
    title: string,
    template?: ProjectTemplate,
    category?: string,
    themeColor?: string,
    icon?: string,
    description?: string
  ) => {
    const created = projectService.createProject(title, template, category, themeColor, icon, description);
    reloadData();
    showToast(`Đã tạo dự án "${title}"`, 'success');
    return created;
  }, [reloadData, showToast]);

  const renameProject = useCallback((id: string, newTitle: string) => {
    const project = projectService.getProject(id);
    const oldTitle = project?.title || '';
    projectService.renameProject(id, newTitle);
    showToast(`Đã đổi tên thành "${newTitle}"`, 'info', {
      onUndo: () => projectService.renameProject(id, oldTitle)
    });
  }, [showToast]);

  const duplicateProject = useCallback((id: string) => {
    const dup = projectService.duplicateProject(id);
    if (dup) {
      showToast(`Đã nhân bản dự án`, 'success');
    }
    return dup;
  }, [showToast]);

  const archiveProject = useCallback((id: string) => {
    projectService.archiveProject(id);
    showToast('Đã lưu trữ dự án', 'info', {
      onUndo: () => projectService.unarchiveProject(id)
    });
  }, [showToast]);

  const unarchiveProject = useCallback((id: string) => {
    projectService.unarchiveProject(id);
    showToast('Đã bỏ lưu trữ dự án', 'success');
  }, [showToast]);

  const trashProject = useCallback((id: string) => {
    projectService.moveToTrash(id);
    showToast('Đã chuyển vào thùng rác', 'warning', {
      onUndo: () => projectService.restoreFromTrash(id)
    });
  }, [showToast]);

  const restoreProject = useCallback((id: string) => {
    projectService.restoreFromTrash(id);
    showToast('Đã khôi phục dự án', 'success');
  }, [showToast]);

  const permanentlyDeleteProject = useCallback((id: string) => {
    projectService.permanentlyDelete(id);
    showToast('Đã xóa vĩnh viễn dự án', 'error');
  }, [showToast]);

  const emptyTrash = useCallback(() => {
    projectService.emptyTrash();
    showToast('Đã dọn sạch thùng rác', 'info');
  }, [showToast]);

  const toggleFavorite = useCallback((id: string) => {
    projectService.toggleFavorite(id);
    const project = projectService.getProject(id);
    if (project?.favorite) {
      showToast('Đã thêm vào yêu thích ♡', 'success');
    }
  }, [showToast]);

  const updateActiveProjectContent = useCallback((updates: Partial<Project['content']>) => {
    projectService.updateActiveProjectContent(updates);
  }, []);

  const updateActiveProject = useCallback((updates: Partial<Project>) => {
    projectService.updateActiveProject(updates);
  }, []);

  const logActivity = useCallback((id: string, type: Project['recentActivity'][0]['type'], description: string) => {
    projectService.logActivity(id, type, description);
  }, []);

  const filteredProjects = projectService.filterAndSort(
    activeView,
    searchQuery,
    sortBy,
    sortDirection,
    categoryFilter
  );

  return (
    <WorkspaceContext.Provider
      value={{
        projects,
        activeProject,
        activeView,
        setActiveView,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        sortDirection,
        setSortDirection,
        categoryFilter,
        setCategoryFilter,
        filteredProjects,
        selectProject,
        createProject,
        renameProject,
        duplicateProject,
        archiveProject,
        unarchiveProject,
        trashProject,
        restoreProject,
        permanentlyDeleteProject,
        emptyTrash,
        toggleFavorite,
        updateActiveProjectContent,
        updateActiveProject,
        logActivity,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useProjectWorkspace = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useProjectWorkspace must be used within a ProjectWorkspaceProvider');
  }
  return context;
};
