export type AICreativeType = 
  | 'love_letter'
  | 'romantic_image'
  | 'memory_video'
  | 'playlist'
  | 'story'
  | 'anniversary_card'
  | 'relationship_advice';

export interface IPromptTemplate {
  id: string;
  title: string;
  description: string;
  category: 'First Date' | 'Wedding' | 'Long Distance' | 'Birthday' | 'Valentine' | 'Apology' | 'Proposal' | 'Missing You' | 'Education' | 'Celebration' | 'Personal' | 'Work' | string;
  creativeType: AICreativeType;
  promptText: string;
  isFavorite?: boolean;
  tags: string[];
}

export interface IPromptBuilderState {
  occasion: string;
  mood: string;
  style: string;
  length: string;
  language: string;
  audience: string;
  aiModel: string;
  customNotes: string;
}

export interface IAITask {
  id: string;
  type: AICreativeType;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number; // 0 - 100
  startedAt: number;
  completedAt?: number;
  result?: {
    text?: string;
    mediaUrl?: string;
    subText?: string;
    metadata?: Record<string, any>;
  };
  error?: string;
  estimatedTokens: number;
  estimatedCost: string;
  durationMs: number;
}

export interface IGenerationHistoryItem {
  id: string;
  taskType: AICreativeType;
  title: string;
  promptUsed: string;
  createdAt: number;
  status: 'completed' | 'failed';
  estimatedCost: string;
  durationMs: number;
  result: {
    text?: string;
    mediaUrl?: string;
    subText?: string;
  };
}
