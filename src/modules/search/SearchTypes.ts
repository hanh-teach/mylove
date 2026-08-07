export type SearchResultType = 
  | 'project' 
  | 'memory' 
  | 'timeline' 
  | 'draft' 
  | 'ai_note' 
  | 'asset' 
  | 'person' 
  | 'place' 
  | 'workflow' 
  | 'export';

export interface ISearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  content?: string;
  snippet?: string;
  icon: string;
  score: number;
  metadata?: {
    date?: string;
    location?: string;
    people?: string[];
    tags?: string[];
    thumbnail?: string;
  };
  relatedIds?: string[];
}

export interface ISavedSearch {
  id: string;
  label: string;
  query: string;
  icon: string;
  createdAt: string;
}

export interface ISearchHistory {
  id: string;
  query: string;
  timestamp: string;
}

export interface ISearchFilter {
  types?: SearchResultType[];
  dateRange?: { start: string; end: string };
  location?: string;
  person?: string;
  tags?: string[];
}
