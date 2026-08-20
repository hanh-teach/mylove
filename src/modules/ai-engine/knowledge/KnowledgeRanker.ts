import { RetrievalResult } from './KnowledgeTypes';

export class KnowledgeRanker {
  /**
   * Sorts search results using a multi-factor ranking model:
   * Score = (Similarity * 0.5) + (ImportanceWeight * 0.3) + (FreshnessWeight * 0.2)
   */
  public static rank(results: RetrievalResult[]): RetrievalResult[] {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    return results.map(res => {
      const parent = res.parentItem;
      
      // Importance Weight: Scale 1-10 mapped to 0.0 - 1.0
      const importanceWeight = (parent.importance ?? 5) / 10;

      // Freshness Weight: Mapped exponentially based on age
      const lastUpdated = new Date(parent.updatedAt).getTime();
      const ageDays = (now - lastUpdated) / oneDayMs;
      const freshnessWeight = Math.exp(-ageDays / 30); // decay over 30 days

      // Compose final ranking score
      const finalScore = (res.similarity * 0.5) + (importanceWeight * 0.3) + (freshnessWeight * 0.2);

      return {
        ...res,
        score: parseFloat(finalScore.toFixed(4))
      };
    }).sort((a, b) => b.score - a.score);
  }
}
