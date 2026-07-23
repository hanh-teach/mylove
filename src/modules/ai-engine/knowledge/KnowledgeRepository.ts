import { KnowledgeItem } from './KnowledgeTypes';
import { KnowledgeValidator } from './KnowledgeValidator';
import { KnowledgeChunker } from './KnowledgeChunker';
import { KnowledgeEmbedding } from './KnowledgeEmbedding';
import { KnowledgeRegistry } from './KnowledgeRegistry';
import { KnowledgePolicy } from './KnowledgePolicy';
import { knowledgeEventBus } from './KnowledgeEvents';

export class KnowledgeRepository {
  /**
   * Safe save process: validates integrity, masks PII, generates vector embeddings, and registers.
   */
  public static async saveItem(rawItem: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    const { isValid, error } = KnowledgeValidator.validate(rawItem);
    if (!isValid) {
      throw new Error(`Data validation error: ${error}`);
    }

    const maskedContent = KnowledgePolicy.maskPII(rawItem.content!);
    
    const item: KnowledgeItem = {
      id: rawItem.id!,
      title: rawItem.title!,
      type: rawItem.type!,
      content: maskedContent,
      owner: rawItem.owner!,
      source: rawItem.source!,
      createdAt: rawItem.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: rawItem.tags || [],
      importance: rawItem.importance ?? 5,
      visibility: rawItem.visibility ?? 'private',
      language: rawItem.language ?? 'vi',
      version: rawItem.version ?? '1.0.0',
      metadata: rawItem.metadata || {}
    };

    if (!KnowledgePolicy.isSafeToEmbed(item)) {
      throw new Error('Security policy violation: item contains sensitive credentials.');
    }

    // Embed parent document
    item.embedding = await KnowledgeEmbedding.generate(item.content);

    // Slice into vector-searchable chunks and embed each chunk
    const chunks = KnowledgeChunker.chunk(item);
    for (const chunk of chunks) {
      chunk.embedding = await KnowledgeEmbedding.generate(chunk.content);
    }

    // Register to active memory registry
    KnowledgeRegistry.register(item, chunks);

    knowledgeEventBus.emit({
      type: 'KNOWLEDGE_CREATED',
      itemId: item.id,
      message: `Successfully indexed knowledge item: "${item.title}" with ${chunks.length} sub-chunks`,
      timestamp: new Date().toISOString()
    });

    return item;
  }

  /**
   * Pre-seeds standard couple relationship profiles and anniversary milestone templates.
   */
  public static async seedDefaultTemplates(ownerId: string): Promise<void> {
    const defaults: Partial<KnowledgeItem>[] = [
      {
        id: 'memory-first-meet',
        title: 'First Meet at Coffee Shop',
        type: 'memory',
        content: 'The first time we met was at the small coffee shop on a rainy afternoon. We talked for hours about our favorite books and music. You ordered a caramel macchiato.',
        owner: ownerId,
        source: 'user_input',
        tags: ['First Meet', 'Relationship']
      },
      {
        id: 'memory-travel-japan',
        title: 'Japan Trip 2024',
        type: 'memory',
        content: 'Our amazing trip to Kyoto, Japan. We walked under the cherry blossoms and tried traditional matcha. We promised to go back in winter.',
        owner: ownerId,
        source: 'user_input',
        tags: ['Travel', 'Relationship']
      },
      {
        id: 'template-anniversary-5yr',
        title: 'Sweet 5th Anniversary',
        type: 'template',
        content: 'Topic for 5th anniversary, recalling our journey from the first meet at the cafe, overcoming challenges, and our promise for the future.',
        owner: ownerId,
        source: 'system',
        tags: ['Anniversary', 'Love Letter']
      },
      {
        id: 'memory-birthday',
        title: 'Surprise Birthday 2023',
        type: 'memory',
        content: 'I threw a surprise birthday party for you with all your friends. You were so happy you cried a little.',
        owner: ownerId,
        source: 'user_input',
        tags: ['Birthday', 'Relationship']
      },
      {
        id: 'system-safety-policy',
        title: 'System AI Safety Standards',
        type: 'policy',
        content: 'AI must adhere strictly to loving, non-offensive, respectful tone. Strictly avoid generation of toxic content, personal insults, or unsafe themes.',
        owner: 'system',
        source: 'governance',
        tags: ['safety', 'moderation']
      }
    ];

    for (const d of defaults) {
      await this.saveItem(d);
    }
  }
}
