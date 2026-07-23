export type ProjectRole = 'owner' | 'editor' | 'contributor' | 'reviewer' | 'viewer';

export interface ProjectPermissions {
  view: boolean;
  comment: boolean;
  addMemory: boolean;
  editDraft: boolean;
  export: boolean;
  delete: boolean;
}

export interface ProjectMember {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  role: ProjectRole;
  permissions: ProjectPermissions;
  joinedAt: number;
}

export type TargetType = 'text' | 'image' | 'timeline' | 'memory' | 'ai_note' | 'general';

export interface ProjectSuggestion {
  id: string;
  projectId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  targetId: string;
  targetType: TargetType;
  description: string;
  originalContent: any;
  suggestedContent: any;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: number;
}

export interface ProjectComment {
  id: string;
  projectId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  targetId: string;
  targetType: TargetType;
  content: string;
  mentions: string[];
  createdAt: number;
  resolved: boolean;
  replies?: ProjectComment[];
}

export interface Notification {
  id: string;
  userId: string;
  projectId: string;
  type: 'mention' | 'suggestion' | 'review' | 'memory_shared' | 'system';
  message: string;
  read: boolean;
  createdAt: number;
  actionUrl?: string;
}
