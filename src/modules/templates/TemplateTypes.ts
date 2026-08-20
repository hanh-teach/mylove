export type TemplateCategory = 
  | 'personal' 
  | 'family' 
  | 'education' 
  | 'work' 
  | 'event';

export type TemplateStyle = 
  | 'formal' 
  | 'warm' 
  | 'humorous' 
  | 'touching' 
  | 'creative';

export interface ITemplatePlaceholder {
  id: string;
  type: 'image' | 'text' | 'timeline_event' | 'checklist_item' | 'signature';
  label: string;
  description?: string;
  required: boolean;
}

export interface ISmartTemplate {
  id: string;
  title: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  icon: string;
  coverImage?: string;
  theme: string;
  aiPromptConfig: {
    systemPrompt: string;
    tone: TemplateStyle;
    suggestedTopics: string[];
  };
  structure: {
    hasTimeline: boolean;
    hasGallery: boolean;
    hasChecklist: boolean;
    hasDraftWriter: boolean;
    hasExportPreset: boolean;
  };
  placeholders: ITemplatePlaceholder[];
  workflowSteps: string[];
  exportPreset: {
    format: 'pdf' | 'web_card' | 'interactive_slides';
    aspectRatio?: 'A4' | '16:9' | 'square';
  };
  isUserCreated?: boolean;
}

export interface ITemplateWizardAnswers {
  category?: TemplateCategory;
  targetAudience?: string;
  style?: TemplateStyle;
  customTitle?: string;
  enabledModules?: {
    timeline: boolean;
    gallery: boolean;
    checklist: boolean;
    aiAssistant: boolean;
  };
}
