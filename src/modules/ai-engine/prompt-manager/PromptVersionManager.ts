import { promptRepository } from './PromptRepository';
import { promptHistory } from './PromptHistory';
import { PromptVersion } from './PromptVersion';
import { PromptTemplate } from './PromptTemplate';

export class PromptVersionManager {
  public create(template: PromptTemplate, version: PromptVersion) {
    template.versions.push(version);
    promptRepository.save(template);
    promptHistory.log({
      templateId: template.id,
      version,
      timestamp: Date.now(),
      action: 'create'
    });
  }

  public publish(templateId: string, versionId: string) {
    const template = promptRepository.get(templateId);
    if (template) {
      template.activeVersionId = versionId;
      promptRepository.save(template);
      promptHistory.log({
        templateId,
        version: template.versions.find(v => v.id === versionId)!,
        timestamp: Date.now(),
        action: 'publish'
      });
    }
  }

  // Add more methods as needed (rollback, archive, etc.)
}

export const promptVersionManager = new PromptVersionManager();
