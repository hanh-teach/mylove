export type KnowledgeSourceType = 'memory' | 'timeline' | 'anniversary' | 'preference' | 'prompt' | 'workflow' | 'policy' | 'asset' | 'template';

export interface KnowledgeItem {
  id: string;
  title: string;
  type: KnowledgeSourceType;
  content: string;
  owner: string;
  source: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  importance: number; // Scale 1 to 10
  visibility: 'private' | 'shared' | 'enterprise';
  language: string;
  version: string;
  metadata?: Record<string, any>;
  embeddingId?: string;
  embedding?: number[];
}

export interface KnowledgeChunk {
  id: string;
  parentId: string;
  content: string;
  index: number;
  metadata: Record<string, any>;
  embedding?: number[];
}

export interface RetrievalQuery {
  text: string;
  userId?: string;
  typeFilter?: KnowledgeSourceType[];
  topK?: number;
  minSimilarity?: number;
}

export interface RetrievalResult {
  chunk: KnowledgeChunk;
  parentItem: KnowledgeItem;
  similarity: number;
  score: number;
}
