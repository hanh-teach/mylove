
export type KnowledgeType = 'person' | 'place' | 'event' | 'object' | 'concept' | 'general';

export interface IKnowledgeItem {
  id: string;
  title: string;
  description: string;
  type: KnowledgeType;
  tags: string[];
  relationships: IKnowledgeRelationship[];
  aiNotes?: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  projectId?: string;
  workspaceId?: string;
}

export interface IKnowledgeRelationship {
  id: string;
  targetId: string;
  targetType: 'memory' | 'timeline' | 'asset' | 'person' | 'place' | 'knowledge' | 'draft' | 'note';
  relationType: string;
  strength: number; // 0 to 1
  description?: string;
  autoDetected?: boolean;
}

export interface IAIMemory {
  id: string;
  projectId: string;
  workspaceId?: string;
  preferences: {
    writingStyle?: string;
    tone?: string;
    endingStyle?: string;
    forbiddenElements?: string[]; // e.g. "no emojis"
    preferredColors?: string[];
    outputFormat?: string; // e.g. "A5 Print"
  };
  keyFacts: {
    key: string;
    value: string;
    lastAccessed: string;
  }[];
  updatedAt: string;
}

export interface IContextUsage {
  id: string;
  timestamp: string;
  action: string;
  contextSources: {
    type: string;
    id: string;
    weight: number;
  }[];
  qualityScore: number;
}
