import { RetrievalResult } from './KnowledgeTypes';

export class KnowledgeContextBuilder {
  /**
   * Translates matching retrieval outputs into clean, formatted markdown injection sections.
   */
  public static buildPromptContext(results: RetrievalResult[]): string {
    if (results.length === 0) {
      return 'No specific background knowledge retrieved for this prompt context.';
    }

    // Deduplicate parent items to avoid redundant background noise
    const seenParentIds = new Set<string>();
    const formattedBlocks: string[] = [];

    results.forEach(res => {
      const parent = res.parentItem;
      const chunk = res.chunk;

      if (!seenParentIds.has(parent.id)) {
        seenParentIds.add(parent.id);
        
        let block = `### Background Document: ${parent.title} (Type: ${parent.type}, Importance: ${parent.importance}/10)\n`;
        block += `Tags: ${parent.tags.join(', ')}\n`;
        block += `Content Snippet: "${chunk.content}"`;
        
        formattedBlocks.push(block);
      } else {
        // If the parent is already logged, append additional chunk contents directly under it
        const blockIdx = Array.from(seenParentIds).indexOf(parent.id);
        if (formattedBlocks[blockIdx]) {
          formattedBlocks[blockIdx] += `\nAdditional Snippet: "${chunk.content}"`;
        }
      }
    });

    return [
      '== RETRIEVED RELATIONSHIP KNOWLEDGE AND CONTEXTS ==',
      'The following curated facts, anniversary milestones, and user memories are matched as highly relevant. Use them to craft personalized, emotionally rich, and authentic letters or planning workflows:',
      ...formattedBlocks,
      '== END OF RETRIEVED KNOWLEDGE =='
    ].join('\n\n');
  }
}
