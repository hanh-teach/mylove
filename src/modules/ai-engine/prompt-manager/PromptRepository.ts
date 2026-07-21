import { PromptTemplate } from './PromptTemplate';
import { PromptVersion } from './PromptVersion';

export class PromptRepository {
  private templates: Map<string, PromptTemplate> = new Map();

  public save(template: PromptTemplate) {
    this.templates.set(template.id, template);
  }

  public get(id: string): PromptTemplate | undefined {
    return this.templates.get(id);
  }

  public getAll(): PromptTemplate[] {
    return Array.from(this.templates.values());
  }
}

export const promptRepository = new PromptRepository();
