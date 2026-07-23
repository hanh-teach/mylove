import { Project, ProjectTemplate, PROJECT_TEMPLATES } from './Project';

export class ProjectManager {
  public static createDefaultProject(
    title: string,
    template: ProjectTemplate = 'card',
    category = 'General',
    themeColor = '#e11d48',
    icon = '💖',
    description = ''
  ): Project {
    const config = PROJECT_TEMPLATES[template] || PROJECT_TEMPLATES.card;
    const now = Date.now();
    const id = `proj-${now}-${Math.random().toString(36).substring(2, 7)}`;

    return {
      id,
      title: title.trim() || 'Dự án mới',
      description: description || config.description,
      template,
      category,
      status: 'draft',
      version: '1.0',
      progress: 0,
      favorite: false,
      themeColor,
      icon,
      thumbnail: `https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=600&q=80`,
      content: {
        title: title.trim() || 'Dự án mới',
        message: 'Soạn thảo nội dung ý nghĩa của bạn tại đây...',
        placedItems: [],
        scene: config.defaultScene,
        bgStyle: config.defaultBgStyle,
        fontStyle: config.defaultFontStyle,
        textColor: 'default',
        wordCount: 8
      },
      createdAt: now,
      updatedAt: now,
      lastEditedText: 'Vừa xong',
      tags: [config.labelVi],
      
      // PM 2.0 Initialization
      lifecyclePhase: 'idea',
      health: 'good',
      healthStatus: {
        content: 0,
        media: 0,
        timeline: 0,
        overall: 'good'
      },
      insight: {
        totalMemories: 0,
        totalAssets: 0,
        totalEvents: 0,
        aiDrafts: 0,
        manualDrafts: 0,
        completionPrediction: 'Dự kiến hoàn thành trong 3 ngày tới'
      },
      checklist: config.checklist || [],
      
      // Sprint 78 Intelligence Initialization
      priorityTasks: [
        { id: 'p1', label: 'Hoàn thành lời mở đầu', priority: 5, impact: 'Tăng 20% tiến độ', completed: false },
        { id: 'p2', label: 'Kiểm tra chính tả', priority: 4, impact: 'Cải thiện chất lượng', completed: false }
      ],
      dailyFocus: ['Hoàn thiện chương 3', 'Thêm ảnh bìa'],
      workspaceInsights: [
        { id: 'i1', type: 'warning', message: 'Thiếu ảnh bìa dự án', confidence: 'high', category: 'media', actionLabel: 'Thêm ngay' },
        { id: 'i2', type: 'suggestion', message: 'Bạn có 3 bản nháp chưa xem lại', confidence: 'medium', category: 'content', actionLabel: 'Xem' }
      ],
      productivity: {
        weeklyProjects: 1,
        weeklyHours: 0,
        newMemories: 0,
        aiAssists: 0,
        completedProjects: 0
      },
      intelligenceSettings: {
        showInsights: true,
        showProductivity: true,
        showSmartReminders: true,
        activeCoach: true
      },

      recentActivity: [
        {
          id: `act-${now}`,
          type: 'system',
          description: `Bắt đầu dự án mới: ${title}`,
          timestamp: now
        }
      ],
      coachSuggestions: [
        'Chào mừng! Hãy bắt đầu bằng cách hoàn thành các mục trong checklist.',
        'Bạn có thể sử dụng AI Assistant để gợi ý ý tưởng.'
      ],

      memoriesCount: 0,
      workflowTasksCount: 0
    };
  }

  public static duplicate(project: Project): Project {
    const now = Date.now();
    const id = `proj-${now}-${Math.random().toString(36).substring(2, 7)}`;

    return {
      ...project,
      id,
      title: `${project.title} (Bản sao)`,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      lastEditedText: 'Vừa xong',
      favorite: false
    };
  }

  public static updateContent(
    project: Project,
    contentUpdates: Partial<Project['content']>
  ): Project {
    const now = Date.now();
    const newContent = { ...project.content, ...contentUpdates };
    
    // Auto-calculate word count
    const words = (newContent.title + ' ' + newContent.message).trim().split(/\s+/).filter(Boolean).length;
    newContent.wordCount = words;

    return {
      ...project,
      content: newContent,
      updatedAt: now,
      lastEditedText: 'Vừa xong',
      progress: Math.min(100, Math.max(10, Math.floor(words / 2)))
    };
  }
}
