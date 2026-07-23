import { Project } from './Project';
import { ProjectRepository } from './ProjectRepository';
import { ProjectSearch } from './ProjectSearch';
import { ProjectSorter, SortField, SortDirection } from './ProjectSorter';
import { ProjectFavorites } from './ProjectFavorites';
import { ProjectArchive } from './ProjectArchive';
import { ProjectTrash } from './ProjectTrash';
import { ProjectManager } from './ProjectManager';

export class ProjectService {
  private projects: Project[] = [];
  private activeProjectId: string | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.projects = ProjectRepository.getAll();
    this.activeProjectId = ProjectRepository.getActiveId();
    if (!this.projects.some((p) => p.id === this.activeProjectId)) {
      this.activeProjectId = this.projects[0]?.id || null;
    }
  }

  public getProjects(): Project[] {
    return this.projects;
  }

  public getProject(id: string): Project | undefined {
    return this.projects.find((p) => p.id === id);
  }

  public getActiveProject(): Project | undefined {
    return this.projects.find((p) => p.id === this.activeProjectId) || this.projects[0];
  }

  public setActiveProject(id: string): void {
    if (this.projects.some((p) => p.id === id)) {
      this.activeProjectId = id;
      ProjectRepository.setActiveId(id);
      this.notify();
    }
  }

  public createProject(
    title: string,
    template = 'card' as any,
    category = 'General',
    themeColor = '#e11d48',
    icon = '💖',
    description = ''
  ): Project {
    const newProj = ProjectManager.createDefaultProject(title, template, category, themeColor, icon, description);
    this.projects = [newProj, ...this.projects];
    this.activeProjectId = newProj.id;
    this.saveAndNotify();
    return newProj;
  }

  public renameProject(id: string, newTitle: string): void {
    this.projects = this.projects.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          title: newTitle.trim() || p.title,
          content: { ...p.content, title: newTitle.trim() || p.content.title },
          updatedAt: Date.now(),
          lastEditedText: 'Vừa xong'
        };
      }
      return p;
    });
    this.saveAndNotify();
  }

  public duplicateProject(id: string): Project | null {
    const target = this.projects.find((p) => p.id === id);
    if (!target) return null;
    const copy = ProjectManager.duplicate(target);
    this.projects = [copy, ...this.projects];
    this.activeProjectId = copy.id;
    this.saveAndNotify();
    return copy;
  }

  public archiveProject(id: string): void {
    this.projects = ProjectArchive.archive(this.projects, id);
    this.saveAndNotify();
  }

  public unarchiveProject(id: string): void {
    this.projects = ProjectArchive.unarchive(this.projects, id);
    this.saveAndNotify();
  }

  public moveToTrash(id: string): void {
    this.projects = ProjectTrash.moveToTrash(this.projects, id);
    if (this.activeProjectId === id) {
      const activeRest = this.projects.find((p) => p.status !== 'trash');
      if (activeRest) this.setActiveProject(activeRest.id);
    }
    this.saveAndNotify();
  }

  public restoreFromTrash(id: string): void {
    this.projects = ProjectTrash.restoreFromTrash(this.projects, id);
    this.saveAndNotify();
  }

  public permanentlyDelete(id: string): void {
    this.projects = ProjectTrash.permanentlyDelete(this.projects, id);
    if (this.activeProjectId === id) {
      this.activeProjectId = this.projects[0]?.id || null;
    }
    this.saveAndNotify();
  }

  public emptyTrash(): void {
    this.projects = ProjectTrash.emptyTrash(this.projects);
    this.saveAndNotify();
  }

  public toggleFavorite(id: string): void {
    this.projects = ProjectFavorites.toggleFavorite(this.projects, id);
    this.saveAndNotify();
  }

  public updateActiveProjectContent(contentUpdates: Partial<Project['content']>): void {
    if (!this.activeProjectId) return;
    this.projects = this.projects.map((p) => {
      if (p.id === this.activeProjectId) {
        return ProjectManager.updateContent(p, contentUpdates);
      }
      return p;
    });
    this.saveAndNotify();
  }

  public updateActiveProject(updates: Partial<Project>): void {
    if (!this.activeProjectId) return;
    this.projects = this.projects.map((p) => {
      if (p.id === this.activeProjectId) {
        const newProject = {
          ...p,
          ...updates,
          updatedAt: Date.now(),
          lastEditedText: 'Vừa xong'
        };

        // Recalculate health if checklist or progress changed
        if (updates.checklist || updates.progress !== undefined || updates.content) {
          const completed = newProject.checklist.filter(i => i.completed).length;
          const total = newProject.checklist.length;
          const ratio = total > 0 ? completed / total : 1;
          
          // Health Engine 2.0
          const contentHealth = Math.min(100, Math.round(((newProject.content.wordCount || 0) / 500) * 100));
          const mediaHealth = Math.min(100, (newProject.memoriesCount || 0) * 10);
          const timelineHealth = Math.min(100, (newProject.workflowTasksCount || 0) * 20);

          newProject.healthStatus = {
            content: contentHealth,
            media: mediaHealth,
            timeline: timelineHealth,
            overall: 'good'
          };

          if (newProject.progress > 80 && ratio > 0.8 && contentHealth > 70) newProject.health = 'excellent';
          else if (newProject.progress < 30 || contentHealth < 20) newProject.health = 'warning';
          else newProject.health = 'good';

          // Intelligence Engine 2.0
          const insights: Project['workspaceInsights'] = [];
          
          // Warnings
          if (!newProject.icon || newProject.icon === '📁') {
            insights.push({ id: 'w1', type: 'warning', message: 'Dự án chưa có biểu tượng riêng', confidence: 'high', category: 'quality', actionLabel: 'Chọn icon' });
          }
          if ((newProject.content.wordCount || 0) < 50) {
            insights.push({ id: 'w2', type: 'warning', message: 'Nội dung còn quá ngắn', confidence: 'high', category: 'content', actionLabel: 'Viết thêm' });
          }
          if (!newProject.memoriesCount || newProject.memoriesCount === 0) {
            insights.push({ id: 'w3', type: 'warning', message: 'Chưa có kỷ niệm nào được đính kèm', confidence: 'high', category: 'media', actionLabel: 'Thêm ngay' });
          }

          // Suggestions
          if (newProject.progress > 70 && !newProject.checklist.some(i => i.label.includes('lời kết') && i.completed)) {
            insights.push({ id: 's1', type: 'suggestion', message: 'Dự án sắp hoàn thành, bạn nên viết lời kết', confidence: 'medium', category: 'content', actionLabel: 'Soạn thảo' });
          }
          if (newProject.lifecyclePhase === 'writing') {
            insights.push({ id: 's2', type: 'tip', message: 'Thử dùng AI Suggestion để làm phong phú văn phong', confidence: 'medium', category: 'content', actionLabel: 'Mở AI' });
          }

          newProject.workspaceInsights = insights.slice(0, 5);

          // Priority Ranking
          const priorityTasks: Project['priorityTasks'] = [];
          if (!newProject.content.title) priorityTasks.push({ id: 'pr1', label: 'Đặt tên cho dự án', priority: 5, impact: 'Định hình chủ đề', completed: false });
          if ((newProject.content.wordCount || 0) < 100) priorityTasks.push({ id: 'pr2', label: 'Hoàn thiện nội dung chính', priority: 4, impact: 'Tăng 30% tiến độ', completed: false });
          if (!newProject.memoriesCount) priorityTasks.push({ id: 'pr3', label: 'Thu thập ảnh kỷ niệm', priority: 3, impact: 'Làm sinh động dự án', completed: false });
          
          newProject.priorityTasks = [...priorityTasks, ...newProject.priorityTasks.filter(t => t.id.startsWith('p'))].slice(0, 4);

          // Daily Focus
          if (newProject.lifecyclePhase === 'idea') newProject.dailyFocus = ['Phác thảo ý tưởng', 'Tìm chủ đề chính'];
          else if (newProject.lifecyclePhase === 'writing') newProject.dailyFocus = ['Viết 100 từ mới', 'Kiểm tra mạch văn'];
          else if (newProject.lifecyclePhase === 'designing') newProject.dailyFocus = ['Chọn layout phù hợp', 'Chỉnh sửa màu sắc'];
        }

        return newProject;
      }
      return p;
    });
    this.saveAndNotify();
  }

  public logActivity(id: string, type: Project['recentActivity'][0]['type'], description: string): void {
    this.projects = this.projects.map((p) => {
      if (p.id === id) {
        const activity: Project['recentActivity'][0] = {
          id: `act-${Date.now()}`,
          type,
          description,
          timestamp: Date.now()
        };
        return {
          ...p,
          recentActivity: [activity, ...p.recentActivity.slice(0, 19)]
        };
      }
      return p;
    });
    this.saveAndNotify();
  }

  public filterAndSort(
    view: 'projects' | 'favorites' | 'recent' | 'archive' | 'trash',
    query = '',
    sortField: SortField = 'date',
    sortDir: SortDirection = 'desc',
    categoryFilter = 'all'
  ): Project[] {
    let list = this.projects;

    // View filter
    if (view === 'favorites') {
      list = list.filter((p) => p.favorite && p.status !== 'trash');
    } else if (view === 'archive') {
      list = list.filter((p) => p.status === 'archived');
    } else if (view === 'trash') {
      list = list.filter((p) => p.status === 'trash');
    } else if (view === 'recent') {
      list = list.filter((p) => p.status !== 'trash');
    } else {
      // 'projects'
      list = list.filter((p) => p.status !== 'trash' && p.status !== 'archived');
    }

    // Category filter
    if (categoryFilter && categoryFilter !== 'all') {
      list = list.filter((p) => p.category === categoryFilter || p.template === categoryFilter);
    }

    // Search query
    list = ProjectSearch.search(list, query);

    // Sort
    return ProjectSorter.sort(list, sortField, sortDir);
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private saveAndNotify(): void {
    ProjectRepository.saveAll(this.projects);
    if (this.activeProjectId) {
      ProjectRepository.setActiveId(this.activeProjectId);
    }
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }
}

export const projectService = new ProjectService();
