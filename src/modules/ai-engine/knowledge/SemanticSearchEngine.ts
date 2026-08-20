import { KnowledgeSearch } from './KnowledgeSearch';
import { RetrievalQuery, RetrievalResult } from './KnowledgeTypes';

export class SemanticSearchEngine {
  /**
   * Performs semantic-vector matching against indexed chunk structures using the base KnowledgeSearch.
   */
  public static async search(query: RetrievalQuery): Promise<RetrievalResult[]> {
    return await KnowledgeSearch.search(query);
  }
}
