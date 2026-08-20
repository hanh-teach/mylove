import { KnowledgeContextBuilder } from './KnowledgeContextBuilder';
import { RetrievalResult } from './KnowledgeTypes';

export class ContextBuilder {
  /**
   * Translates matching retrieval outputs into clean, formatted markdown injection sections.
   */
  public static buildPromptContext(results: RetrievalResult[], reasonTrace?: any): string {
    let baseContext = KnowledgeContextBuilder.buildPromptContext(results);
    
    if (reasonTrace) {
      baseContext += `\n\n### Reasoning Trace & Goal Constraints\n`;
      baseContext += `- Selected Option: ${reasonTrace.selectedOption?.name}\n`;
      baseContext += `- Analyzed Emotion: ${reasonTrace.evidence?.analysis?.emotion}\n`;
      baseContext += `- Analyzed Theme: ${reasonTrace.evidence?.analysis?.theme}\n`;
      if (reasonTrace.evidence?.conflictsResolved?.length) {
        baseContext += `- Conflicts Handled: ${reasonTrace.evidence.conflictsResolved.join('; ')}\n`;
      }
    }
    
    return baseContext;
  }
}
