import { Project, ProjectActivity } from '../workspace/Project';
import { ProjectMember, ProjectRole, ProjectPermissions, ProjectSuggestion, ProjectComment, Notification } from './types';
import { projectService } from '../workspace/ProjectService';

const DEFAULT_PERMISSIONS: Record<ProjectRole, ProjectPermissions> = {
  owner: { view: true, comment: true, addMemory: true, editDraft: true, export: true, delete: true },
  editor: { view: true, comment: true, addMemory: true, editDraft: true, export: true, delete: false },
  contributor: { view: true, comment: true, addMemory: true, editDraft: false, export: false, delete: false },
  reviewer: { view: true, comment: true, addMemory: false, editDraft: false, export: false, delete: false },
  viewer: { view: true, comment: false, addMemory: false, editDraft: false, export: false, delete: false }
};

export class CollaborationService {
  private static instance: CollaborationService;
  
  public static getInstance(): CollaborationService {
    if (!this.instance) {
      this.instance = new CollaborationService();
    }
    return this.instance;
  }

  // --- Members ---
  public addMember(
    projectId: string, 
    userId: string, 
    name: string, 
    role: ProjectRole, 
    avatar?: string,
    status: 'pending' | 'active' = 'active',
    email?: string
  ): ProjectMember {
    const project = projectService.getProject(projectId);
    if (!project) throw new Error('Project not found');

    const member: ProjectMember = {
      id: `member_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId,
      name,
      avatar,
      role,
      permissions: DEFAULT_PERMISSIONS[role],
      joinedAt: Date.now(),
      status,
      email
    };

    const members = [...(project.members || []), member];
    projectService.updateProject(projectId, { members });
    this.addActivity(
      projectId, 
      'system', 
      status === 'pending' 
        ? `Đã mời ${email || name} tham gia dự án với vai trò ${role}`
        : `Đã thêm ${name} vào dự án với vai trò ${role}`
    );
    
    return member;
  }

  public updateMemberRole(projectId: string, memberId: string, role: ProjectRole): void {
    const project = projectService.getProject(projectId);
    if (!project || !project.members) return;

    const members = project.members.map(m => 
      m.id === memberId ? { ...m, role, permissions: DEFAULT_PERMISSIONS[role] } : m
    );
    projectService.updateProject(projectId, { members });
  }

  public updateMemberRoleAndPermissions(
    projectId: string, 
    memberId: string, 
    role: ProjectRole, 
    permissions: ProjectPermissions,
    status?: 'pending' | 'active',
    name?: string
  ): void {
    const project = projectService.getProject(projectId);
    if (!project || !project.members) return;

    const members = project.members.map(m => {
      if (m.id === memberId) {
        return { 
          ...m, 
          role, 
          permissions, 
          status: status !== undefined ? status : m.status,
          name: name !== undefined ? name : m.name
        };
      }
      return m;
    });
    projectService.updateProject(projectId, { members });
    
    const target = project.members.find(m => m.id === memberId);
    if (target) {
      this.addActivity(
        projectId, 
        'system', 
        `Đã cập nhật vai trò/quyền hạn của ${target.name} thành ${role}`
      );
    }
  }

  public removeMember(projectId: string, memberId: string): void {
    const project = projectService.getProject(projectId);
    if (!project || !project.members) return;

    const target = project.members.find(m => m.id === memberId);
    const members = project.members.filter(m => m.id !== memberId);
    projectService.updateProject(projectId, { members });

    if (target) {
      this.addActivity(
        projectId, 
        'system', 
        `Đã loại bỏ ${target.name} khỏi dự án`
      );
    }
  }

  // --- Suggestions ---
  public addSuggestion(projectId: string, suggestion: Omit<ProjectSuggestion, 'id' | 'createdAt' | 'status'>): ProjectSuggestion {
    const project = projectService.getProject(projectId);
    if (!project) throw new Error('Project not found');

    const newSuggestion: ProjectSuggestion = {
      ...suggestion,
      id: `sugg_${Date.now()}`,
      status: 'pending',
      createdAt: Date.now()
    };

    const suggestions = [...(project.suggestions || []), newSuggestion];
    projectService.updateProject(projectId, { suggestions });
    this.addActivity(projectId, 'edit', `${suggestion.authorName} đã thêm một đề xuất mới`);
    return newSuggestion;
  }

  public resolveSuggestion(projectId: string, suggestionId: string, action: 'accepted' | 'rejected'): void {
    const project = projectService.getProject(projectId);
    if (!project || !project.suggestions) return;

    const suggestions = project.suggestions.map(s => 
      s.id === suggestionId ? { ...s, status: action } : s
    );
    projectService.updateProject(projectId, { suggestions });
    
    const sugg = suggestions.find(s => s.id === suggestionId);
    if (sugg) {
       this.addActivity(projectId, 'system', `Đề xuất của ${sugg.authorName} đã bị ${action === 'accepted' ? 'chấp nhận' : 'từ chối'}`);
    }
  }

  // --- Comments ---
  public addComment(projectId: string, comment: Omit<ProjectComment, 'id' | 'createdAt' | 'resolved' | 'replies'>): ProjectComment {
    const project = projectService.getProject(projectId);
    if (!project) throw new Error('Project not found');

    const newComment: ProjectComment = {
      ...comment,
      id: `comment_${Date.now()}`,
      createdAt: Date.now(),
      resolved: false,
      replies: []
    };

    const comments = [...(project.comments || []), newComment];
    projectService.updateProject(projectId, { comments });
    return newComment;
  }

  public resolveComment(projectId: string, commentId: string): void {
    const project = projectService.getProject(projectId);
    if (!project || !project.comments) return;

    const comments = project.comments.map(c => 
      c.id === commentId ? { ...c, resolved: true } : c
    );
    projectService.updateProject(projectId, { comments });
  }

  // --- Activity Feed ---
  private addActivity(projectId: string, type: ProjectActivity['type'], description: string): void {
    const project = projectService.getProject(projectId);
    if (!project) return;

    const activity: ProjectActivity = {
      id: `act_${Date.now()}_${Math.random()}`,
      type,
      description,
      timestamp: Date.now()
    };

    const recentActivity = [activity, ...(project.recentActivity || [])].slice(0, 50);
    projectService.updateProject(projectId, { recentActivity });
  }

  // --- Notifications ---
  public getNotifications(userId: string): Notification[] {
    // In a real app, fetch from database. Here we return mock data or localStorage.
    return [];
  }
}

export const collaborationService = CollaborationService.getInstance();
