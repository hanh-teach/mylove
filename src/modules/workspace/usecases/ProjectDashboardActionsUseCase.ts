import { Project } from '../Project';
import { templateService, ISmartTemplate } from '../../templates/TemplateService';

export class ProjectDashboardActionsUseCase {
  static toggleChecklist(project: Project, itemId: string): Partial<Project> {
    const newChecklist = (project.checklist || []).map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    return { checklist: newChecklist };
  }

  static togglePriorityTask(project: Project, taskId: string): Partial<Project> {
    const deduplicatedTasks = Array.from(
      new Map((project.priorityTasks || []).map((t: any) => [t.id, t])).values()
    );
    const newTasks = deduplicatedTasks.map((task: any) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    return { priorityTasks: newTasks };
  }

  static createCustomTemplate(project: Project): ISmartTemplate {
    const customTemplate: ISmartTemplate = {
      id: `custom-tpl-${Date.now()}`,
      title: `${project.title} (Bản Mẫu)`,
      description: project.description || 'Mẫu được lưu từ dự án của bạn',
      category: (project.metadata?.smartTemplate?.category as any) || 'personal',
      tags: project.tags || [],
      icon: 'Star',
      theme: project.themeColor,
      aiPromptConfig: project.metadata?.smartTemplate?.aiPromptConfig || {
        systemPrompt: 'Hỗ trợ viết theo phong cách cá nhân',
        tone: 'creative',
        suggestedTopics: [],
      },
      structure: {
        hasTimeline: true,
        hasGallery: true,
        hasChecklist: (project.checklist || []).length > 0,
        hasDraftWriter: true,
        hasExportPreset: true,
      },
      placeholders: [],
      workflowSteps: [],
      exportPreset: {
        format: 'pdf',
        aspectRatio: 'A4',
      },
      isUserCreated: true,
    };

    templateService.saveCustomTemplate(customTemplate);
    return customTemplate;
  }
}
