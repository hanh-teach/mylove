import { promptComposer, PromptContext, CreativePromptTemplate } from './PromptComposer';

export class PromptComposerService {
  public composePrompt(template: CreativePromptTemplate, context: PromptContext): string {
    return promptComposer.compose(template, context);
  }
}

export const promptComposerService = new PromptComposerService();
