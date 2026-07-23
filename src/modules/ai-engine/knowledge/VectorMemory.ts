import { KnowledgeEmbedding } from './KnowledgeEmbedding';
import { KnowledgeChunk } from './KnowledgeTypes';

/**
 * Transient Vector Memory Store.
 * Note: If no production vector database exists, we use this abstract interface.
 * Persistent vector storage is currently marked as UNVERIFIED.
 */
export class VectorMemory {
  private static store = new Map<string, KnowledgeChunk>();

  public static async index(chunk: KnowledgeChunk): Promise<void> {
    if (!chunk.embedding) {
      chunk.embedding = await KnowledgeEmbedding.generate(chunk.content);
    }
    this.store.set(chunk.id, chunk);
  }

  public static async search(queryVector: number[], topK: number = 5, minSimilarity: number = 0.3): Promise<{chunk: KnowledgeChunk, similarity: number}[]> {
    const results: {chunk: KnowledgeChunk, similarity: number}[] = [];
    
    for (const chunk of this.store.values()) {
      if (chunk.embedding) {
        const similarity = KnowledgeEmbedding.computeCosineSimilarity(queryVector, chunk.embedding);
        if (similarity >= minSimilarity) {
          results.push({ chunk, similarity });
        }
      }
    }
    
    return results.sort((a, b) => b.similarity - a.similarity).slice(0, topK);
  }

  public static clear(): void {
    this.store.clear();
  }
}
