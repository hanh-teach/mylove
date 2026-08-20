import { getVisualPrompt } from './prompt';

export class PromptBuilder {
  /**
   * Generates a high-fidelity visual description prompt based on scene and placed decorations.
   */
  public buildVideoPrompt(scene: string, placedItems: any[]): string {
    return getVisualPrompt(scene, placedItems);
  }

  /**
   * Generates a simple message generation prompt for custom love or card texts.
   */
  public buildCardTextPrompt(theme: string, style: string, extraKeywords?: string): string {
    return `Generate a short, touching romantic greeting message for a card. Theme: ${theme}, Style: ${style}. ${extraKeywords ? `Keywords to include: ${extraKeywords}.` : ''} Keep it beautiful, sincere, and brief.`;
  }
}

export const promptBuilder = new PromptBuilder();
