import { Project, ProjectTemplate } from './Project';

const STORAGE_KEY = 'lovenote_workspace_projects_v58';
const ACTIVE_PROJECT_KEY = 'lovenote_active_project_id_v58';

export const INITIAL_SAMPLE_PROJECTS: Project[] = [
  {
    id: 'proj-teacher-card',
    title: 'Teacher Card',
    description: 'Thiệp tri ân Thầy Cô giáo nhân ngày 20/11',
    template: 'card',
    category: 'Tri ân & Tôn vinh',
    status: 'draft',
    version: '1.2',
    progress: 85,
    favorite: true,
    themeColor: '#e11d48',
    icon: '🌸',
    thumbnail: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80',
    content: {
      title: 'Tri Ân Thầy Cô Kính Yêu 🌸',
      message: 'Kính gửi Thầy Cô, cảm ơn Thầy Cô vì những tri thức bao la và lòng kiên nhẫn vô bờ bến dành cho chúng con.',
      placedItems: [
        { id: 1, type: 'Flower2', x: -100, y: -80, scale: 1.2, rotation: 15, color: '#f43f5e', animation: 'float' },
        { id: 2, type: 'Sparkles', x: 120, y: -90, scale: 1.0, rotation: 0, color: '#eab308', animation: 'pulse' }
      ],
      scene: 'rose',
      bgStyle: 'hearts',
      fontStyle: 'playfair',
      textColor: 'red',
      wordCount: 145
    },
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 3600000 * 2,
    lastEditedText: '2 giờ trước',
    tags: ['Tri ân', 'Thầy Cô', 'Thiệp'],
    lifecyclePhase: 'writing',
    health: 'excellent',
    healthStatus: { content: 90, media: 80, timeline: 70, overall: 'excellent' },
    insight: { totalMemories: 4, totalAssets: 8, totalEvents: 2, aiDrafts: 2, manualDrafts: 1, completionPrediction: 'Hôm nay' },
    checklist: [],
    recentActivity: [],
    coachSuggestions: [],
    priorityTasks: [
      { id: 'p1', label: 'Hoàn thành lời mở đầu', priority: 5, impact: 'Tăng 20% tiến độ', completed: false }
    ],
    dailyFocus: ['Kiểm tra chính tả'],
    workspaceInsights: [],
    productivity: { weeklyProjects: 1, weeklyHours: 10, newMemories: 5, aiAssists: 2, completedProjects: 0 },
    intelligenceSettings: { showInsights: true, showProductivity: true, showSmartReminders: true, activeCoach: true },
    memoriesCount: 4,
    workflowTasksCount: 2
  },
  {
    id: 'proj-birthday-card',
    title: 'Birthday Card',
    description: 'Thiệp chúc mừng sinh nhật bạn thân',
    template: 'invitation',
    category: 'Sinh nhật & Kỷ niệm',
    status: 'draft',
    version: '1.0',
    progress: 60,
    favorite: true,
    themeColor: '#d97706',
    icon: '🎂',
    thumbnail: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
    content: {
      title: 'Happy Birthday My Dear Friend! 🥳',
      message: 'Chúc bạn tuổi mới luôn rạng rỡ, ngập tràn niềm vui, sức khỏe và đạt được mọi ước mơ!',
      placedItems: [
        { id: 1, type: 'Cake', x: 0, y: 100, scale: 1.3, rotation: 0, color: '#f59e0b', animation: 'bounce' },
        { id: 2, type: 'Balloon', x: -140, y: -60, scale: 1.1, rotation: -10, animation: 'float' }
      ],
      scene: 'sunset',
      bgStyle: 'floating',
      fontStyle: 'pacifico',
      textColor: 'default',
      wordCount: 88
    },
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 3600000 * 5,
    lastEditedText: '5 giờ trước',
    tags: ['Sinh nhật', 'Bạn thân'],
    lifecyclePhase: 'planning',
    health: 'good',
    healthStatus: { content: 60, media: 50, timeline: 40, overall: 'good' },
    insight: { totalMemories: 3, totalAssets: 6, totalEvents: 1, aiDrafts: 1, manualDrafts: 1, completionPrediction: '2 ngày' },
    checklist: [],
    recentActivity: [],
    coachSuggestions: [],
    priorityTasks: [],
    dailyFocus: [],
    workspaceInsights: [],
    productivity: { weeklyProjects: 1, weeklyHours: 5, newMemories: 3, aiAssists: 1, completedProjects: 0 },
    intelligenceSettings: { showInsights: true, showProductivity: true, showSmartReminders: true, activeCoach: true },
    memoriesCount: 3,
    workflowTasksCount: 1
  },
  {
    id: 'proj-daily-journal',
    title: 'Daily Journal',
    description: 'Nhật ký tự ngẫm và lưu giữ khoảnh khắc',
    template: 'journal',
    category: 'Nhật ký & Cảm xúc',
    status: 'draft',
    version: '2.0',
    progress: 100,
    favorite: false,
    themeColor: '#059669',
    icon: '📖',
    thumbnail: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80',
    content: {
      title: 'Nhật Ký Ngày Bình Yên ✨',
      message: 'Hôm nay một ngày nắng nhẹ. Cùng nhâm nhi tách trà buổi sáng và nhìn lại những dự định đáng trân trọng.',
      placedItems: [
        { id: 1, type: 'Smile', x: 130, y: -100, scale: 1.0, rotation: 0, color: '#10b981', animation: 'none' }
      ],
      scene: 'garden',
      bgStyle: 'solid',
      fontStyle: 'caveat',
      textColor: 'emerald',
      wordCount: 320
    },
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 86400000 * 1,
    lastEditedText: '1 ngày trước',
    tags: ['Nhật ký', 'Tự ngẫm'],
    lifecyclePhase: 'archived',
    health: 'excellent',
    healthStatus: { content: 100, media: 100, timeline: 100, overall: 'excellent' },
    insight: { totalMemories: 12, totalAssets: 24, totalEvents: 4, aiDrafts: 8, manualDrafts: 4, completionPrediction: 'Hoàn tất' },
    checklist: [],
    recentActivity: [],
    coachSuggestions: [],
    priorityTasks: [],
    dailyFocus: [],
    workspaceInsights: [],
    productivity: { weeklyProjects: 2, weeklyHours: 20, newMemories: 12, aiAssists: 5, completedProjects: 1 },
    intelligenceSettings: { showInsights: true, showProductivity: true, showSmartReminders: true, activeCoach: true },
    memoriesCount: 12,
    workflowTasksCount: 4
  },
  {
    id: 'proj-graduation-speech',
    title: 'Graduation Speech',
    description: 'Bài phát biểu truyền cảm hứng Lễ Tốt Nghiệp',
    template: 'speech',
    category: 'Bài phát biểu',
    status: 'draft',
    version: '1.5',
    progress: 90,
    favorite: true,
    themeColor: '#2563eb',
    icon: '🎤',
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80',
    content: {
      title: 'Hành Trình Vươn Xa & Khát Vọng 🎓',
      message: 'Kính thưa quý thầy cô, phụ huynh cùng toàn thể bạn sinh viên. Hôm nay là cột mốc đánh dấu sự trưởng thành...',
      placedItems: [
        { id: 1, type: 'Star', x: 0, y: -120, scale: 1.2, rotation: 0, color: '#3b82f6', animation: 'pulse' }
      ],
      scene: 'sky',
      bgStyle: 'solid',
      fontStyle: 'lora',
      textColor: 'blue',
      wordCount: 520
    },
    createdAt: Date.now() - 86400000 * 12,
    updatedAt: Date.now() - 3600000 * 12,
    lastEditedText: '12 giờ trước',
    tags: ['Tốt nghiệp', 'Trang trọng'],
    lifecyclePhase: 'reviewing',
    health: 'excellent',
    healthStatus: { content: 95, media: 70, timeline: 80, overall: 'excellent' },
    insight: { totalMemories: 5, totalAssets: 10, totalEvents: 3, aiDrafts: 3, manualDrafts: 2, completionPrediction: 'Sắp xong' },
    checklist: [],
    recentActivity: [],
    coachSuggestions: [],
    priorityTasks: [],
    dailyFocus: [],
    workspaceInsights: [],
    productivity: { weeklyProjects: 1, weeklyHours: 15, newMemories: 5, aiAssists: 3, completedProjects: 0 },
    intelligenceSettings: { showInsights: true, showProductivity: true, showSmartReminders: true, activeCoach: true },
    memoriesCount: 5,
    workflowTasksCount: 3
  },
  {
    id: 'proj-family-album',
    title: 'Family Album',
    description: 'Kỷ yếu gia đình & những hành trình đáng nhớ',
    template: 'story',
    category: 'Gia đình & Kỷ niệm',
    status: 'draft',
    version: '1.1',
    progress: 75,
    favorite: false,
    themeColor: '#7c3aed',
    icon: '📚',
    thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80',
    content: {
      title: 'Gia Đình Là Nơi Để Về 🏡',
      message: 'Tổng hợp những chuyến đi dã ngoại cuối tuần và các bữa cơm ấm áp bên người thân.',
      placedItems: [
        { id: 1, type: 'Users', x: -110, y: -70, scale: 1.1, rotation: 0, color: '#8b5cf6', animation: 'float' }
      ],
      scene: 'plain',
      bgStyle: 'blobs',
      fontStyle: 'playfair',
      textColor: 'purple',
      wordCount: 240
    },
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 2,
    lastEditedText: '2 ngày trước',
    tags: ['Gia đình', 'Album'],
    lifecyclePhase: 'collecting',
    health: 'good',
    healthStatus: { content: 75, media: 90, timeline: 60, overall: 'good' },
    insight: { totalMemories: 8, totalAssets: 16, totalEvents: 2, aiDrafts: 4, manualDrafts: 2, completionPrediction: '3 ngày' },
    checklist: [],
    recentActivity: [],
    coachSuggestions: [],
    priorityTasks: [],
    dailyFocus: [],
    workspaceInsights: [],
    productivity: { weeklyProjects: 1, weeklyHours: 12, newMemories: 8, aiAssists: 2, completedProjects: 0 },
    intelligenceSettings: { showInsights: true, showProductivity: true, showSmartReminders: true, activeCoach: true },
    memoriesCount: 8,
    workflowTasksCount: 2
  }
];

export class ProjectRepository {
  public static getAll(): Project[] {
    if (typeof window === 'undefined') return INITIAL_SAMPLE_PROJECTS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading projects from localStorage', e);
    }
    // Initialize default if empty
    this.saveAll(INITIAL_SAMPLE_PROJECTS);
    return INITIAL_SAMPLE_PROJECTS;
  }

  public static saveAll(projects: Project[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Error saving projects to localStorage', e);
    }
  }

  public static getActiveId(): string {
    if (typeof window === 'undefined') return INITIAL_SAMPLE_PROJECTS[0].id;
    try {
      const saved = localStorage.getItem(ACTIVE_PROJECT_KEY);
      if (saved) return saved;
    } catch (e) {}
    return INITIAL_SAMPLE_PROJECTS[0].id;
  }

  public static setActiveId(id: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ACTIVE_PROJECT_KEY, id);
    } catch (e) {}
  }
}
