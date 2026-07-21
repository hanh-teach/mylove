import { PromptTemplate, PromptTemplateData } from './PromptTemplate';

export class PromptRepository {
  private templates: Map<string, Map<string, PromptTemplate>> = new Map();

  public register(data: PromptTemplateData) {
    if (!this.templates.has(data.id)) {
      this.templates.set(data.id, new Map());
    }
    const versions = this.templates.get(data.id)!;
    versions.set(data.version, new PromptTemplate(data));
  }

  public get(id: string, version?: string): PromptTemplate | undefined {
    const versions = this.templates.get(id);
    if (!versions) return undefined;

    if (version) {
      return versions.get(version);
    }

    // Get latest version (simplified logic: sort and get last)
    const sortedVersions = Array.from(versions.keys()).sort((a, b) => b.localeCompare(a));
    return versions.get(sortedVersions[0]);
  }

  public getAllLatest(): PromptTemplate[] {
    const result: PromptTemplate[] = [];
    for (const id of this.templates.keys()) {
      const latest = this.get(id);
      if (latest) result.push(latest);
    }
    return result;
  }
}

export const promptRepository = new PromptRepository();
