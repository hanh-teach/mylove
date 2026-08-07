
export type EntityType = 
  | 'memory' 
  | 'timeline_event' 
  | 'person' 
  | 'place' 
  | 'asset' 
  | 'draft' 
  | 'project' 
  | 'tag' 
  | 'ai_note';

export interface Relationship {
  id: string;
  sourceId: string;
  sourceType: EntityType;
  targetId: string;
  targetType: EntityType;
  type: string; // e.g., 'related', 'mention', 'captured_at', 'includes'
  aiSuggested?: boolean;
  confidence?: 'high' | 'medium' | 'low';
  createdAt: number;
}

export interface Person {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  bio?: string;
  birthday?: string;
  tags: string[];
  createdAt: number;
}

export interface Place {
  id: string;
  name: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  description?: string;
  thumbnail?: string;
  tags: string[];
  createdAt: number;
}
