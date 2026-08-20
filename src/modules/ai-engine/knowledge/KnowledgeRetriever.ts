import { RetrievalQuery, RetrievalResult } from './KnowledgeTypes';
import { KnowledgeCache } from './KnowledgeCache';
import { KnowledgePolicy } from './KnowledgePolicy';
import { KnowledgeSearch } from './KnowledgeSearch';
import { KnowledgeRanker } from './KnowledgeRanker';
import { knowledgeEventBus } from './KnowledgeEvents';

export class KnowledgeRetriever {
  /**
   * Main retrieve process: checks cache, executes policy constraints, queries similarity models, ranks top matches.
   */
  public static async retrieve(query: RetrievalQuery, requesterRole: string = 'LoveLetterAgent'): Promise<RetrievalResult[]> {
    const startTime = Date.now();
    const typeFilters = query.typeFilter || [];

    // 1. Enforce safety policies over requested resource domains
    if (typeFilters.length > 0) {
      const allAllowed = typeFilters.every(t => KnowledgePolicy.isAccessAllowed(requesterRole, t));
      if (!allAllowed) {
        throw new Error(`Unauthorized access to requested knowledge types for agent: ${requesterRole}`);
      }
    }

    // 2. Perform cache lookups
    const cached = KnowledgeCache.get(query.text, query.userId, typeFilters);
    if (cached) {
      knowledgeEventBus.emit({
        type: 'KNOWLEDGE_RETRIEVED',
        query,
        resultsCount: cached.length,
        message: `Knowledge retrieved from cache (latency: ${Date.now() - startTime}ms)`,
        timestamp: new Date().toISOString()
      });
      return cached;
    }

    // 3. Search vector space
    const searchResults = await KnowledgeSearch.search(query);

    // 4. Rank items based on multi-criteria models
    const rankedResults = KnowledgeRanker.rank(searchResults);

    // 5. Populate cache
    KnowledgeCache.set(query.text, rankedResults, query.userId, typeFilters);

    knowledgeEventBus.emit({
      type: 'KNOWLEDGE_RETRIEVED',
      query,
      resultsCount: rankedResults.length,
      message: `Knowledge retrieved via semantic indices (latency: ${Date.now() - startTime}ms)`,
      timestamp: new Date().toISOString()
    });

    return rankedResults;
  }
}
