import { KnowledgeItem, KnowledgeChunk } from './KnowledgeTypes';

export interface ChunkingOptions {
  maxChunkSize?: number;
  overlapSize?: number;
}

export class KnowledgeChunker {
  /**
   * Splits a large KnowledgeItem into sub-chunks, maintaining parent reference links.
   */
  public static chunk(item: KnowledgeItem, options: ChunkingOptions = {}): KnowledgeChunk[] {
    const maxChunkSize = options.maxChunkSize ?? 500; // word/char count
    const overlapSize = options.overlapSize ?? 50;

    const content = item.content;
    const words = content.split(/\s+/);
    
    if (words.length <= maxChunkSize) {
      return [
        {
          id: `${item.id}-c0`,
          parentId: item.id,
          content: content,
          index: 0,
          metadata: {
            title: item.title,
            type: item.type,
            tags: item.tags,
            wordCount: words.length
          }
        }
      ];
    }

    const chunks: KnowledgeChunk[] = [];
    let currentIndex = 0;
    let chunkCount = 0;

    while (currentIndex < words.length) {
      const endIdx = Math.min(currentIndex + maxChunkSize, words.length);
      const chunkWords = words.slice(currentIndex, endIdx);
      const chunkText = chunkWords.join(' ');

      chunks.push({
        id: `${item.id}-c${chunkCount}`,
        parentId: item.id,
        content: chunkText,
        index: chunkCount,
        metadata: {
          title: item.title,
          type: item.type,
          tags: item.tags,
          wordCount: chunkWords.length,
          slice: `${currentIndex}-${endIdx}`
        }
      });

      chunkCount++;
      currentIndex += (maxChunkSize - overlapSize);
    }

    return chunks;
  }
}
