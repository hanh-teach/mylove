import { IMemory } from '../../../modules/memory/MemoryTypes';
import { NoteDocument } from '../../../components/editor/DocumentModel';

export interface RelationshipProfile {
  partnerName: string;
  userName: string;
  nickname: string;
  anniversary: string;
  favoriteFlower: string;
  isConfigured: boolean;
}

export interface TimelineMilestone {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
}

export interface ContextCompletenessItem {
  key: string;
  label: string;
  fulfilled: boolean;
}

export interface EditorContextState {
  relationship: RelationshipProfile;
  timeline: TimelineMilestone | null;
  memories: IMemory[];
  selectedMemory: IMemory | null;
  selectedText: string;
  document: NoteDocument | null;
  mood: string;
  occasion: string;
  attachedImages: string[];
  attachedMusic: string[];
  completenessScore: number;
  completenessBreakdown: ContextCompletenessItem[];
}
