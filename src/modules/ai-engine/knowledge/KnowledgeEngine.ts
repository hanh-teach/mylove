import { KnowledgeItem, RetrievalQuery, RetrievalResult } from './KnowledgeTypes';
import { KnowledgeRepository } from './KnowledgeRepository';
import { KnowledgeRetriever } from './KnowledgeRetriever';
import { ContextBuilder } from './ContextBuilder';
import { KnowledgeRegistry } from './KnowledgeRegistry';
import { KnowledgeMetrics, PerformanceMetrics } from './KnowledgeMetrics';

export class KnowledgeEngine {
  /**
   * Safe save process: validates integrity, masks PII, generates vector embeddings, and registers.
   */
  public async indexKnowledge(item: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    return await KnowledgeRepository.saveItem(item);
  }

  /**
   * Retrieves relevant knowledge and packages it into an optimized markdown context block for LLM prompts.
   */
  public async getPromptContextForGoal(goal: string, userId?: string, requesterRole: string = 'LoveLetterAgent', reasonTrace?: any): Promise<string> {
    const query: RetrievalQuery = {
      text: goal,
      userId,
      topK: 5,
      minSimilarity: 0.35
    };

    const results = await KnowledgeRetriever.retrieve(query, requesterRole);
    return ContextBuilder.buildPromptContext(results, reasonTrace);
  }

  /**
   * Direct access query searching for manual UI interactions or visual graph debugging components.
   */
  public async queryKnowledge(query: RetrievalQuery, requesterRole: string = 'LoveLetterAgent'): Promise<RetrievalResult[]> {
    return await KnowledgeRetriever.retrieve(query, requesterRole);
  }

  /**
   * Seeds demo templates securely to test systems instantly.
   */
  public async seedDefaultTemplates(ownerId: string): Promise<void> {
    await KnowledgeRepository.seedDefaultTemplates(ownerId);
  }

  /**
   * Clears the current active runtime registry.
   */
  public clearRegistry(): void {
    KnowledgeRegistry.clear();
  }

  /**
   * Exposes active system performance insights.
   */
  public getMetrics(): PerformanceMetrics {
    return KnowledgeMetrics.getMetrics();
  }
}

export const knowledgeEngine = new KnowledgeEngine();
