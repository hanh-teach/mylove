import { KnowledgeItem, KnowledgeChunk } from './KnowledgeTypes';

export class KnowledgeRegistry {
  private static registeredItems = new Map<string, KnowledgeItem>();
  private static registeredChunks = new Map<string, KnowledgeChunk[]>();

  public static register(item: KnowledgeItem, chunks: KnowledgeChunk[]): void {
    this.registeredItems.set(item.id, item);
    this.registeredChunks.set(item.id, chunks);
  }

  public static deregister(itemId: string): void {
    this.registeredItems.delete(itemId);
    this.registeredChunks.delete(itemId);
  }

  public static get(itemId: string): KnowledgeItem | undefined {
    return this.registeredItems.get(itemId);
  }

  public static getChunks(itemId: string): KnowledgeChunk[] {
    return this.registeredChunks.get(itemId) || [];
  }

  public static getAllItems(): KnowledgeItem[] {
    return Array.from(this.registeredItems.values());
  }

  public static getAllChunks(): KnowledgeChunk[] {
    const allChunks: KnowledgeChunk[] = [];
    this.registeredChunks.forEach(chunks => {
      allChunks.push(...chunks);
    });
    return allChunks;
  }

  public static clear(): void {
    this.registeredItems.clear();
    this.registeredChunks.clear();
  }
}
