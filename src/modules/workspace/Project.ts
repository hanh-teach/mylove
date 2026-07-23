export type ProjectTemplate = 
  | 'letter'
  | 'card'
  | 'journal'
  | 'speech'
  | 'story'
  | 'notebook'
  | 'invitation'
  | 'custom';

export type ProjectStatus = 'draft' | 'published' | 'archived' | 'trash';

export type ProjectLifecyclePhase = 
  | 'idea' 
  | 'planning' 
  | 'collecting' 
  | 'writing' 
  | 'designing' 
  | 'reviewing' 
  | 'exporting' 
  | 'archived';

export type ProjectHealth = 'excellent' | 'good' | 'warning' | 'critical';

export interface ProjectActivity {
  id: string;
  type: 'edit' | 'add' | 'ai' | 'export' | 'system';
  description: string;
  timestamp: number;
  metadata?: any;
}

export interface ProjectChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  required?: boolean;
}

export interface ProjectTemplateConfig {
  id: ProjectTemplate;
  label: string;
  labelVi: string;
  icon: string;
  description: string;
  defaultScene: string;
  defaultBgStyle: string;
  defaultFontStyle: string;
  checklist?: ProjectChecklistItem[];
  suggestedWorkflows?: string[];
}

export const PROJECT_TEMPLATES: Record<ProjectTemplate, ProjectTemplateConfig> = {
  letter: {
    id: 'letter',
    label: 'Letter',
    labelVi: 'Thư ngỏ & Thư tay',
    icon: '✉️',
    description: 'Bức thư tâm tình, tri ân chân thành',
    defaultScene: 'rose',
    defaultBgStyle: 'solid',
    defaultFontStyle: 'dancing',
    checklist: [
      { id: '1', label: 'Xác định người nhận', completed: false, required: true },
      { id: '2', label: 'Soạn thảo nội dung chính', completed: false, required: true },
      { id: '3', label: 'Chọn font chữ viết tay', completed: false },
      { id: '4', label: 'Thêm chữ ký cá nhân', completed: false }
    ],
    suggestedWorkflows: ['Tư vấn văn phong thư', 'Kiểm tra lỗi chính tả']
  },
  card: {
    id: 'card',
    label: 'Card',
    labelVi: 'Thiệp chúc mừng',
    icon: '💖',
    description: 'Thiệp thiệp nghệ thuật kèm vật trang trí',
    defaultScene: 'plain',
    defaultBgStyle: 'hearts',
    defaultFontStyle: 'playfair',
    checklist: [
      { id: '1', label: 'Chọn chủ đề thiệp', completed: false, required: true },
      { id: '2', label: 'Viết lời chúc ngắn gọn', completed: false, required: true },
      { id: '3', label: 'Thêm sticker decor', completed: false },
      { id: '4', label: 'Chọn nhạc nền (nếu có)', completed: false }
    ],
    suggestedWorkflows: ['Gợi ý lời chúc ý nghĩa', 'Bố cục sticker tự động']
  },
  journal: {
    id: 'journal',
    label: 'Journal',
    labelVi: 'Nhật ký cá nhân',
    icon: '📖',
    description: 'Ghi chép cảm xúc và ký ức mỗi ngày',
    defaultScene: 'sunset',
    defaultBgStyle: 'blobs',
    defaultFontStyle: 'caveat',
    checklist: [
      { id: '1', label: 'Ghi lại sự kiện trong ngày', completed: false, required: true },
      { id: '2', label: 'Đính kèm ảnh kỷ niệm', completed: false },
      { id: '3', label: 'Ghi chú cảm xúc hiện tại', completed: false, required: true },
      { id: '4', label: 'Tổng kết bài học', completed: false }
    ]
  },
  speech: {
    id: 'speech',
    label: 'Speech',
    labelVi: 'Bài phát biểu',
    icon: '🎤',
    description: 'Bài nói truyền cảm hứng, trang trọng',
    defaultScene: 'sky',
    defaultBgStyle: 'solid',
    defaultFontStyle: 'lora',
    checklist: [
      { id: '1', label: 'Mở đầu ấn tượng', completed: false, required: true },
      { id: '2', label: 'Luận điểm chính 1', completed: false, required: true },
      { id: '3', label: 'Câu chuyện minh họa', completed: false },
      { id: '4', label: 'Lời kết cảm động', completed: false, required: true }
    ]
  },
  story: {
    id: 'story',
    label: 'Story',
    labelVi: 'Truyện ngắn & Kỷ yếu',
    icon: '📚',
    description: 'Hành trình kỷ niệm dài theo thời gian',
    defaultScene: 'forest',
    defaultBgStyle: 'grid',
    defaultFontStyle: 'playfair',
  },
  notebook: {
    id: 'notebook',
    label: 'Notebook',
    labelVi: 'Sổ tay ý tưởng',
    icon: '📝',
    description: 'Sổ tay tổng hợp ghi chú và phác thảo',
    defaultScene: 'garden',
    defaultBgStyle: 'solid',
    defaultFontStyle: 'nunito',
  },
  invitation: {
    id: 'invitation',
    label: 'Invitation',
    labelVi: 'Thư mời sự kiện',
    icon: '💌',
    description: 'Thiệp mời tiệc, sinh nhật, lễ kỷ niệm',
    defaultScene: 'sakura',
    defaultBgStyle: 'floating',
    defaultFontStyle: 'pacifico',
  },
  custom: {
    id: 'custom',
    label: 'Custom',
    labelVi: 'Tùy chỉnh tự do',
    icon: '🎨',
    description: 'Thiết kế dự án không giới hạn',
    defaultScene: 'plain',
    defaultBgStyle: 'solid',
    defaultFontStyle: 'playfair',
  },
};

export interface ProjectContent {
  title: string;
  message: string;
  placedItems: any[];
  scene: string;
  bgStyle: string;
  fontStyle: string;
  textColor: string;
  wordCount?: number;
}

export type ProjectHealthStatus = {
  content: number;
  media: number;
  timeline: number;
  overall: ProjectHealth;
};

export interface ProjectInsight {
  totalMemories: number;
  totalAssets: number;
  totalEvents: number;
  aiDrafts: number;
  manualDrafts: number;
  completionPrediction: string;
}

export type PriorityLevel = 1 | 2 | 3 | 4 | 5;

export interface PriorityTask {
  id: string;
  label: string;
  priority: PriorityLevel;
  impact: string;
  completed: boolean;
}

export interface WorkspaceInsight {
  id: string;
  type: 'warning' | 'suggestion' | 'tip';
  message: string;
  confidence: 'high' | 'medium' | 'low';
  actionLabel?: string;
  category: 'content' | 'media' | 'timeline' | 'quality';
}

export interface ProductivityStats {
  weeklyProjects: number;
  weeklyHours: number;
  newMemories: number;
  aiAssists: number;
  completedProjects: number;
}

export interface IntelligenceSettings {
  showInsights: boolean;
  showProductivity: boolean;
  showSmartReminders: boolean;
  activeCoach: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  template: ProjectTemplate;
  category: string;
  status: ProjectStatus;
  version: string;
  progress: number; // 0 - 100
  favorite: boolean;
  themeColor: string;
  icon: string;
  thumbnail?: string;
  content: ProjectContent;
  createdAt: number;
  updatedAt: number;
  lastEditedText?: string;
  tags?: string[];
  
  // Project Management 2.0 Fields
  lifecyclePhase: ProjectLifecyclePhase;
  health: ProjectHealth;
  healthStatus: ProjectHealthStatus;
  insight: ProjectInsight;
  checklist: ProjectChecklistItem[];
  recentActivity: ProjectActivity[];
  coachSuggestions: string[];
  lastState?: {
    tab: string;
    viewMode?: string;
    scrollPos?: number;
    zoom?: number;
    lastStyle?: string;
    activeFilters?: any;
  };

  // Sprint 78: Smart Intelligence Fields
  priorityTasks: PriorityTask[];
  dailyFocus: string[];
  workspaceInsights: WorkspaceInsight[];
  productivity: ProductivityStats;
  intelligenceSettings: IntelligenceSettings;

  memoriesCount?: number;
  workflowTasksCount?: number;
  metadata?: any;
}
