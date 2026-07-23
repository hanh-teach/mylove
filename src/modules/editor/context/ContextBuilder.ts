import { EditorContextState, RelationshipProfile, TimelineMilestone, ContextCompletenessItem } from './ContextTypes';
import { IMemory } from '../../../modules/memory/MemoryTypes';
import { NoteDocument } from '../../../components/editor/DocumentModel';

const DEFAULT_RELATIONSHIP: RelationshipProfile = {
  partnerName: 'Linh',
  userName: 'Nam',
  nickname: 'Bé Heo',
  anniversary: '12/05/2022',
  favoriteFlower: 'Rose',
  isConfigured: true,
};

const DEFAULT_TIMELINE: TimelineMilestone = {
  id: 'tm_1',
  title: 'Anniversary 2024 (First Date)',
  date: '12/05/2022',
  location: 'Café Mộc Đà Lạt',
  category: 'Milestone',
};

export function computeCompleteness(
  relationship: RelationshipProfile,
  timeline: TimelineMilestone | null,
  selectedMemory: IMemory | null,
  mood: string,
  selectedText: string
): { score: number; breakdown: ContextCompletenessItem[] } {
  const breakdown: ContextCompletenessItem[] = [
    { key: 'relationship', label: 'Relationship', fulfilled: !!relationship && relationship.isConfigured },
    { key: 'timeline', label: 'Timeline', fulfilled: !!timeline },
    { key: 'memory', label: 'Memory', fulfilled: !!selectedMemory },
    { key: 'mood', label: 'Mood', fulfilled: !!mood },
    { key: 'selection', label: 'Selection / Doc', fulfilled: true }, // always has doc
  ];

  const fulfilledCount = breakdown.filter(item => item.fulfilled).length;
  const score = Math.round((fulfilledCount / breakdown.length) * 100);

  return { score, breakdown };
}

export function buildInitialContext(): EditorContextState {
  const relationship = DEFAULT_RELATIONSHIP;
  const timeline = DEFAULT_TIMELINE;
  const selectedMemory: IMemory | null = null;
  const selectedText = '';
  const document: NoteDocument | null = null;
  const mood = 'romantic';
  const occasion = 'Anniversary';
  const attachedImages: string[] = [];
  const attachedMusic: string[] = [];

  const { score, breakdown } = computeCompleteness(relationship, timeline, selectedMemory, mood, selectedText);

  return {
    relationship,
    timeline,
    memories: [],
    selectedMemory,
    selectedText,
    document,
    mood,
    occasion,
    attachedImages,
    attachedMusic,
    completenessScore: score,
    completenessBreakdown: breakdown,
  };
}
