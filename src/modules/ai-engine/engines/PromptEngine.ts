import { promptRepository } from './PromptRepository';
import { promptBuilder, PromptOptions, BuiltPrompt } from './PromptBuilder';

export class PromptEngine {
  constructor() {
    this.registerDefaultTemplates();
  }

  private registerDefaultTemplates() {
    promptRepository.register({
      id: 'image-gen',
      name: 'Image Generation',
      version: '1.0.0',
      system: 'You are an expert AI image prompt engineer.',
      developer: 'Optimize the user query for high-quality image generation models like Stable Diffusion or Midjourney.',
      user: 'Create a visually stunning image based on the following context: {{context}}. Specific request: {{query}}'
    });
    
    promptRepository.register({
      id: 'asset-suggest',
      name: 'Asset Suggestion',
      version: '1.0.0',
      system: 'You are a creative director for a multimedia design tool.',
      user: 'Based on the project theme: {{context}}, suggest 5 suitable assets for the scene: {{query}}'
    });
  }

  public compile(templateId: string, variables: Record<string, string>, options: Omit<PromptOptions, 'variables'> = {}): BuiltPrompt {
    const template = promptRepository.get(templateId);
    if (!template) throw new Error(`Template ${templateId} not found`);

    return promptBuilder.build(template, { ...options, variables });
  }

  public getRawTemplate(templateId: string, version?: string) {
    return promptRepository.get(templateId, version);
  }
}

export const promptEngine = new PromptEngine();
