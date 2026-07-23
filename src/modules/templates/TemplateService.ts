import { 
  ISmartTemplate, 
  ITemplateWizardAnswers, 
  TemplateCategory, 
  TemplateStyle 
} from './TemplateTypes';

class TemplateService {
  private STORAGE_KEY = 'lovenote_smart_templates';

  getTemplates(): ISmartTemplate[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    const userTemplates: ISmartTemplate[] = data ? JSON.parse(data) : [];
    return [...this.getSeedTemplates(), ...userTemplates];
  }

  getTemplateById(id: string): ISmartTemplate | undefined {
    return this.getTemplates().find(t => t.id === id);
  }

  saveCustomTemplate(template: ISmartTemplate) {
    const data = localStorage.getItem(this.STORAGE_KEY);
    const userTemplates: ISmartTemplate[] = data ? JSON.parse(data) : [];
    const index = userTemplates.findIndex(t => t.id === template.id);
    if (index >= 0) {
      userTemplates[index] = template;
    } else {
      userTemplates.push({ ...template, isUserCreated: true });
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userTemplates));
  }

  recommendTemplate(answers: ITemplateWizardAnswers): ISmartTemplate {
    const templates = this.getTemplates();
    
    // Attempt exact category + tone match
    let matched = templates.find(t => 
      t.category === answers.category && t.aiPromptConfig.tone === answers.style
    );

    if (!matched) {
      matched = templates.find(t => t.category === answers.category);
    }

    if (!matched) {
      matched = templates[0];
    }

    // Clone and customize according to wizard answers
    const customized: ISmartTemplate = JSON.parse(JSON.stringify(matched));
    if (answers.customTitle) {
      customized.title = answers.customTitle;
    }
    if (answers.enabledModules) {
      customized.structure.hasTimeline = answers.enabledModules.timeline;
      customized.structure.hasGallery = answers.enabledModules.gallery;
      customized.structure.hasChecklist = answers.enabledModules.checklist;
    }
    return customized;
  }

  private getSeedTemplates(): ISmartTemplate[] {
    return [
      {
        id: 'tpl-teacher-gratitude',
        title: 'Thiệp & Kỷ Yếu Tri Ân Thầy Cô',
        description: 'Mẫu dự án kỷ niệm lớp học, tổng hợp lời chúc trang trọng và khoảnh khắc đáng nhớ dành cho thầy cô.',
        category: 'education',
        tags: ['Thầy Cô', 'Tri Ân', 'Kỷ Yếu'],
        icon: 'GraduationCap',
        coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
        theme: 'emerald-gold',
        aiPromptConfig: {
          systemPrompt: 'Viết lời nhắn gửi tri ân thầy cô bằng văn phong trang trọng, thể hiện sự biết ơn sâu sắc và kính trọng.',
          tone: 'formal',
          suggestedTopics: ['Lời tri ân mái trường', 'Kỷ niệm tiết học đáng nhớ', 'Lời chúc sức khỏe']
        },
        structure: {
          hasTimeline: true,
          hasGallery: true,
          hasChecklist: true,
          hasDraftWriter: true,
          hasExportPreset: true
        },
        placeholders: [
          { id: 'ph1', type: 'image', label: 'Ảnh tập thể lớp', required: true },
          { id: 'ph2', type: 'text', label: 'Lời cảm ơn từ tập thể', required: true },
          { id: 'ph3', type: 'timeline_event', label: 'Cột mốc năm học', required: false },
          { id: 'ph4', type: 'signature', label: 'Chữ ký các thành viên', required: true }
        ],
        workflowSteps: [
          'Thu thập hình ảnh kỷ niệm',
          'Soạn lời chúc tri ân bằng AI Assistant',
          'Đánh dấu cột mốc sự kiện',
          'Xuất file PDF Kỷ Yếu'
        ],
        exportPreset: {
          format: 'pdf',
          aspectRatio: 'A4'
        }
      },
      {
        id: 'tpl-family-birthday',
        title: 'Mừng Sinh Nhật Ấm Áp Gia Đình',
        description: 'Tổng hợp lời chúc, timeline sự kiện và album ảnh mừng sinh nhật người thân.',
        category: 'family',
        tags: ['Sinh Nhật', 'Gia Đình', 'Kỷ Niệm'],
        icon: 'Cake',
        coverImage: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800',
        theme: 'rose-gold',
        aiPromptConfig: {
          systemPrompt: 'Viết lời chúc sinh nhật ấm áp, tràn đầy tình yêu thương gia đình.',
          tone: 'touching',
          suggestedTopics: ['Kỷ niệm tuổi thơ', 'Lời chúc sức khỏe & bình an', 'Món quà ý nghĩa']
        },
        structure: {
          hasTimeline: true,
          hasGallery: true,
          hasChecklist: true,
          hasDraftWriter: true,
          hasExportPreset: true
        },
        placeholders: [
          { id: 'ph1', type: 'image', label: 'Ảnh đại diện chủ nhân tiệc', required: true },
          { id: 'ph2', type: 'text', label: 'Lời chúc mở đầu', required: true },
          { id: 'ph3', type: 'image', label: 'Khoảnh khắc thổi nến', required: false }
        ],
        workflowSteps: [
          'Tạo danh sách công việc chuẩn bị tiệc',
          'Gửi lời chúc ấm áp',
          'Lưu trữ ảnh kỷ niệm'
        ],
        exportPreset: {
          format: 'web_card',
          aspectRatio: 'square'
        }
      },
      {
        id: 'tpl-wedding-anniversary',
        title: 'Album Kỷ Niệm Ngày Cưới',
        description: 'Ghi lại hành trình tình yêu, dấu mốc đáng nhớ và album ảnh cưới lãng mạn.',
        category: 'event',
        tags: ['Đám Cưới', 'Tình Yêu', 'Lãng Mạn'],
        icon: 'Heart',
        coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
        theme: 'blush-pink',
        aiPromptConfig: {
          systemPrompt: 'Soạn lời nhắn gửi lãng mạn, ngọt ngào kỷ niệm ngày chung đôi.',
          tone: 'touching',
          suggestedTopics: ['Lần đầu gặp gỡ', 'Lễ cưới đáng nhớ', 'Chặng đường đã qua']
        },
        structure: {
          hasTimeline: true,
          hasGallery: true,
          hasChecklist: false,
          hasDraftWriter: true,
          hasExportPreset: true
        },
        placeholders: [
          { id: 'ph1', type: 'image', label: 'Ảnh cưới đại diện', required: true },
          { id: 'ph2', type: 'timeline_event', label: 'Ngày cưới chính thức', required: true },
          { id: 'ph3', type: 'text', label: 'Thư tình gửi đối phương', required: true }
        ],
        workflowSteps: [
          'Đăng tải hình ảnh ngày cưới',
          'Viết thư tình kỷ niệm',
          'Tạo timeline chuyến đi kỷ niệm'
        ],
        exportPreset: {
          format: 'interactive_slides',
          aspectRatio: '16:9'
        }
      },
      {
        id: 'tpl-work-presentation',
        title: 'Báo Cáo & Thư Cảm Ơn Đối Tác',
        description: 'Dành cho công việc: Hồ sơ dự án, báo cáo tổng kết và thư cảm ơn đối tác trang trọng.',
        category: 'work',
        tags: ['Công Việc', 'Báo Cáo', 'Đối Tác'],
        icon: 'Briefcase',
        coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800',
        theme: 'slate-pro',
        aiPromptConfig: {
          systemPrompt: 'Soạn thư cảm ơn hoặc báo cáo dự án chuyên nghiệp, trang trọng.',
          tone: 'formal',
          suggestedTopics: ['Tổng kết kết quả đạt được', 'Lời cảm ơn sự hợp tác', 'Định hướng tương lai']
        },
        structure: {
          hasTimeline: true,
          hasGallery: false,
          hasChecklist: true,
          hasDraftWriter: true,
          hasExportPreset: true
        },
        placeholders: [
          { id: 'ph1', type: 'text', label: 'Tóm tắt dự án', required: true },
          { id: 'ph2', type: 'checklist_item', label: 'Các mục tiêu đã hoàn thành', required: true }
        ],
        workflowSteps: [
          'Tổng hợp danh sách công việc',
          'Viết lời cảm ơn chuyên nghiệp',
          'Xuất PDF báo cáo'
        ],
        exportPreset: {
          format: 'pdf',
          aspectRatio: 'A4'
        }
      }
    ];
  }
}

export const templateService = new TemplateService();
