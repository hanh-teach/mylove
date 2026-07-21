export interface PromptContext {
  project?: string;
  scene?: string;
  theme?: string;
  emotion?: string;
  language?: string;
  style?: string;
  relationship?: string;
  userPreference?: Record<string, any>;
  capability?: string;
  provider?: string;
}

export interface CreativePromptTemplate {
  id: string;
  version: string;
  template: string; // Using {{variable}} syntax
}

export class PromptComposer {
  public compose(template: CreativePromptTemplate, context: PromptContext): string {
    let rendered = template.template;
    
    // Map context fields to variables
    const variables: Record<string, string> = {
      project: context.project || '',
      scene: context.scene || '',
      theme: context.theme || '',
      emotion: context.emotion || '',
      language: context.language || '',
      style: context.style || '',
      relationship: context.relationship || '',
      capability: context.capability || '',
      provider: context.provider || '',
    };

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      rendered = rendered.replace(regex, value);
    }
    
    // Handle userPreference if needed
    if (context.userPreference) {
      for (const [key, value] of Object.entries(context.userPreference)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        rendered = rendered.replace(regex, String(value));
      }
    }

    return rendered;
  }
}

export const promptComposer = new PromptComposer();
