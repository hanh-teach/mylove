import { KnowledgeItem, RetrievalQuery, RetrievalResult } from './KnowledgeTypes';

export type KnowledgeEventType =
  | 'KNOWLEDGE_CREATED'
  | 'KNOWLEDGE_UPDATED'
  | 'KNOWLEDGE_DELETED'
  | 'KNOWLEDGE_RETRIEVED'
  | 'KNOWLEDGE_EMBEDDED'
  | 'KNOWLEDGE_INDEXED'
  | 'KNOWLEDGE_POLICY_VIOLATION';

export interface KnowledgeEvent {
  type: KnowledgeEventType;
  itemId?: string;
  query?: RetrievalQuery;
  resultsCount?: number;
  message?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export type KnowledgeEventListener = (event: KnowledgeEvent) => void;

class KnowledgeEventBus {
  private listeners: KnowledgeEventListener[] = [];

  public subscribe(listener: KnowledgeEventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public emit(event: KnowledgeEvent): void {
    console.log(`[KnowledgeEvent] [${event.type}]`, event.message || '', event.itemId || '');
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (e) {
        console.error('[KnowledgeEventBus] Listener error:', e);
      }
    });
  }
}

export const knowledgeEventBus = new KnowledgeEventBus();
