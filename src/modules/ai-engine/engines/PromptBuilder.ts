import { PromptTemplate } from './PromptTemplate';

export interface PromptOptions {
  language?: string;
  style?: string;
  emotion?: string;
  variables?: Record<string, string>;
}

export interface BuiltPrompt {
  system: string;
  developer: string;
  user: string;
  full: string;
}

export class PromptBuilder {
  public build(template: PromptTemplate, options: PromptOptions = {}): BuiltPrompt {
    const vars = { 
      ...(template.data.defaults || {}), 
      ...(options.variables || {}),
      language: options.language || 'English',
      style: options.style || 'Professional',
      emotion: options.emotion || 'Neutral'
    };

    const system = this.inject(template.getSystem(), vars);
    const developer = this.inject(template.getDeveloper(), vars);
    const user = this.inject(template.getUser(), vars);

    // Contextual modifiers
    const modifiers = `\n\n[Output constraints: Language: ${vars.language}, Style: ${vars.style}, Tone/Emotion: ${vars.emotion}]`;
    
    const finalUser = user + modifiers;

    return {
      system,
      developer,
      user: finalUser,
      full: `${system}\n${developer}\n${finalUser}`.trim()
    };
  }

  private inject(text: string, variables: Record<string, string>): string {
    let result = text;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return result;
  }
}

export const promptBuilder = new PromptBuilder();
