import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { MemoryService } from '../../memory/MemoryService';
import { relationshipService } from '../../relationship/RelationshipService';
import {
  findDuplicateMemories,
  findRelationshipSuggestions,
  mergeMemoryCandidate,
  MemoryDuplicateCandidate,
  MemoryRelationshipSuggestion,
} from './KnowledgeGraph';

const DISMISSED_DUPLICATES_KEY = 'lovenote_dismissed_duplicates_v1';
const DISMISSED_SUGGESTIONS_KEY = 'lovenote_dismissed_suggestions_v1';

export interface IntelligenceEngineState {
  duplicates: MemoryDuplicateCandidate[];
  relationshipSuggestions: MemoryRelationshipSuggestion[];
  dismissedDuplicateIds: string[];
  dismissedSuggestionIds: string[];
  isLoading: boolean;

  // Actions
  refresh: () => void;
  dismissDuplicate: (pairId: string) => void;
  mergeMemories: (candidate: MemoryDuplicateCandidate, keepMemoryId: string) => void;
  confirmRelationship: (suggestion: MemoryRelationshipSuggestion) => void;
  confirmAllRelationships: () => void;
  dismissRelationship: (suggestionId: string) => void;
}

export const useIntelligenceEngine = create<IntelligenceEngineState>()(
  subscribeWithSelector(
    devtools(
      (set, get) => {
        const getDismissedDuplicates = (): string[] => {
          try {
            const stored = localStorage.getItem(DISMISSED_DUPLICATES_KEY);
            return stored ? JSON.parse(stored) : [];
          } catch {
            return [];
          }
        };

        const getDismissedSuggestions = (): string[] => {
          try {
            const stored = localStorage.getItem(DISMISSED_SUGGESTIONS_KEY);
            return stored ? JSON.parse(stored) : [];
          } catch {
            return [];
          }
        };

        return {
          duplicates: [],
          relationshipSuggestions: [],
          dismissedDuplicateIds: getDismissedDuplicates(),
          dismissedSuggestionIds: getDismissedSuggestions(),
          isLoading: false,

          refresh: () => {
            set({ isLoading: true });
            const memories = MemoryService.getMemories();
            const people = relationshipService.getPeople();
            const dismissedDupes = get().dismissedDuplicateIds;
            const dismissedSugs = get().dismissedSuggestionIds;

            // Calculate real duplicates
            const dupes = findDuplicateMemories(memories, dismissedDupes);

            // Get existing relationships
            const existingRels = memories.flatMap(m =>
              relationshipService.getRelatedEntities(m.id).map(r => ({
                memoryId: m.id,
                targetId: r.id,
              }))
            );

            // Calculate real relationship suggestions
            const sugs = findRelationshipSuggestions(
              memories,
              people,
              existingRels,
              dismissedSugs
            );

            set({
              duplicates: dupes,
              relationshipSuggestions: sugs,
              isLoading: false,
            });
          },

          dismissDuplicate: (pairId: string) => {
            const newDismissed = Array.from(new Set([...get().dismissedDuplicateIds, pairId]));
            try {
              localStorage.setItem(DISMISSED_DUPLICATES_KEY, JSON.stringify(newDismissed));
            } catch (e) {}
            set({ dismissedDuplicateIds: newDismissed });
            get().refresh();
          },

          mergeMemories: (candidate: MemoryDuplicateCandidate, keepMemoryId: string) => {
            const { keepMemoryId: keepId, updates, deleteMemoryId } = mergeMemoryCandidate(
              candidate,
              keepMemoryId
            );

            // Update keep memory
            MemoryService.updateMemory(keepId, updates);

            // Delete the duplicate memory
            MemoryService.deleteMemory(deleteMemoryId);

            // Dismiss pair
            get().dismissDuplicate(candidate.pairId);
          },

          confirmRelationship: (suggestion: MemoryRelationshipSuggestion) => {
            let personId = suggestion.existingPersonId;

            if (!personId) {
              const newPerson = relationshipService.addPerson({
                name: suggestion.personName,
                tags: ['Gợi ý AI', 'Liên kết mới'],
              });
              personId = newPerson.id;
            }

            relationshipService.addRelationship(
              suggestion.memoryId,
              'memory',
              personId,
              'person',
              'mention'
            );

            const newDismissed = Array.from(new Set([...get().dismissedSuggestionIds, suggestion.id]));
            try {
              localStorage.setItem(DISMISSED_SUGGESTIONS_KEY, JSON.stringify(newDismissed));
            } catch (e) {}
            set({ dismissedSuggestionIds: newDismissed });

            get().refresh();
          },

          confirmAllRelationships: () => {
            const sugs = get().relationshipSuggestions;
            sugs.forEach(s => {
              let personId = s.existingPersonId;
              if (!personId) {
                const newPerson = relationshipService.addPerson({
                  name: s.personName,
                  tags: ['Gợi ý AI', 'Liên kết mới'],
                });
                personId = newPerson.id;
              }
              relationshipService.addRelationship(
                s.memoryId,
                'memory',
                personId,
                'person',
                'mention'
              );
            });

            const allIds = sugs.map(s => s.id);
            const newDismissed = Array.from(new Set([...get().dismissedSuggestionIds, ...allIds]));
            try {
              localStorage.setItem(DISMISSED_SUGGESTIONS_KEY, JSON.stringify(newDismissed));
            } catch (e) {}
            set({ dismissedSuggestionIds: newDismissed });

            get().refresh();
          },

          dismissRelationship: (suggestionId: string) => {
            const newDismissed = Array.from(new Set([...get().dismissedSuggestionIds, suggestionId]));
            try {
              localStorage.setItem(DISMISSED_SUGGESTIONS_KEY, JSON.stringify(newDismissed));
            } catch (e) {}
            set({ dismissedSuggestionIds: newDismissed });
            get().refresh();
          },
        };
      },
      { name: 'IntelligenceEngineStore' }
    )
  )
);

// Atomic Selectors
export const selectIntelligenceDuplicates = (state: IntelligenceEngineState) => state.duplicates;
export const selectIntelligenceRelationshipSuggestions = (state: IntelligenceEngineState) => state.relationshipSuggestions;
export const selectIntelligenceIsLoading = (state: IntelligenceEngineState) => state.isLoading;

// Custom Selector Hooks
export const useIntelligenceDuplicates = () => useIntelligenceEngine(selectIntelligenceDuplicates);
export const useIntelligenceRelationshipSuggestions = () => useIntelligenceEngine(selectIntelligenceRelationshipSuggestions);
export const useIntelligenceIsLoading = () => useIntelligenceEngine(selectIntelligenceIsLoading);
