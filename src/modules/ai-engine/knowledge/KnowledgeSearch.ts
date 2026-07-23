import { RetrievalQuery, RetrievalResult } from './KnowledgeTypes';
import { KnowledgeRegistry } from './KnowledgeRegistry';
import { KnowledgeEmbedding } from './KnowledgeEmbedding';

export class KnowledgeSearch {
  /**
   * Performs semantic-vector matching against indexed chunk structures.
   */
  public static async search(query: RetrievalQuery): Promise<RetrievalResult[]> {
    const text = query.text;
    const topK = query.topK ?? 5;
    const minSimilarity = query.minSimilarity ?? 0.3;
    const typeFilter = query.typeFilter;

    // Generate query embedding vector
    const queryVector = await KnowledgeEmbedding.generate(text);
    const allChunks = KnowledgeRegistry.getAllChunks();
    const results: RetrievalResult[] = [];

    for (const chunk of allChunks) {
      const parent = KnowledgeRegistry.get(chunk.parentId);
      if (!parent) continue;

      // Apply source type filters if specified
      if (typeFilter && typeFilter.length > 0 && !typeFilter.includes(parent.type)) {
        continue;
      }

      // Check ownership
      if (query.userId && parent.owner !== 'system' && parent.owner !== query.userId) {
        continue;
      }

      if (chunk.embedding) {
        const similarity = KnowledgeEmbedding.computeCosineSimilarity(queryVector, chunk.embedding);
        
        // Add hybrid keyword booster
        let keywordBooster = 0;
        const queryTerms = text.toLowerCase().split(/\s+/);
        const chunkLower = chunk.content.toLowerCase();
        
        queryTerms.forEach(term => {
          if (term.length > 2 && chunkLower.includes(term)) {
            keywordBooster += 0.05;
          }
        });

        const totalScore = similarity + Math.min(keywordBooster, 0.2);

        if (similarity >= minSimilarity) {
          results.push({
            chunk,
            parentItem: parent,
            similarity,
            score: totalScore
          });
        }
      }
    }

    // Sort descending by calculated score
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}
