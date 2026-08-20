import { useState, useEffect, useCallback } from 'react';
import { WorkspaceDraftUseCase } from '../usecases/WorkspaceDraftUseCase';
import {
  useIntelligenceEngine,
  useIntelligenceDuplicates,
  useIntelligenceRelationshipSuggestions,
} from '../../ai-engine/knowledge/useIntelligenceEngine';
import { MemoryRelationshipSuggestion } from '../../ai-engine/knowledge/KnowledgeGraph';
import { Project } from '../Project';

export function useWorkspaceBusiness(
  activeProject: Project | null,
  selectProject: (id: string) => void,
  onNavigateTab: (tab: any) => void,
  onContinueEditing: () => void
) {
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [activeDraft, setActiveDraft] = useState<{ document: any; timestamp: number } | null>(null);

  useEffect(() => {
    let isMounted = true;
    WorkspaceDraftUseCase.loadDraft().then((draft) => {
      if (isMounted && draft && draft.document) {
        setActiveDraft(draft);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRestoreDraft = useCallback(() => {
    if (activeDraft) {
      WorkspaceDraftUseCase.restoreDraft(activeDraft);
      setActiveDraft(null);
      onContinueEditing();
    }
  }, [activeDraft, onContinueEditing]);

  const handleDismissDraft = useCallback(async () => {
    await WorkspaceDraftUseCase.clearDraft();
    setActiveDraft(null);
  }, []);

  const duplicates = useIntelligenceDuplicates();
  const relationshipSuggestions = useIntelligenceRelationshipSuggestions();

  useEffect(() => {
    useIntelligenceEngine.getState().refresh();
  }, []);

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Chào buổi sáng' : currentHour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

  const handleOpenProject = useCallback(
    (project: Project) => {
      selectProject(project.id);
      onNavigateTab('project-dashboard');
    },
    [selectProject, onNavigateTab]
  );

  const handleMergeClick = useCallback(
    (pairId: string) => {
      const candidate = duplicates.find((d) => d.pairId === pairId);
      if (!candidate) return;
      if (
        window.confirm(
          `Bạn có chắc chắn muốn hợp nhất kỷ niệm "${candidate.memoryB.title}" vào "${candidate.memoryA.title}"?\nNội dung và thẻ của bản sao sẽ được chuyển vào kỷ niệm chính.`
        )
      ) {
        useIntelligenceEngine.getState().mergeMemories(candidate, candidate.memoryA.id);
      }
    },
    [duplicates]
  );

  const totalInsightsCount = duplicates.length + relationshipSuggestions.length;

  const dismissDuplicate = useCallback((pairId: string) => {
    useIntelligenceEngine.getState().dismissDuplicate(pairId);
  }, []);

  const confirmRelationship = useCallback((suggestion: MemoryRelationshipSuggestion) => {
    useIntelligenceEngine.getState().confirmRelationship(suggestion);
  }, []);

  const confirmAllRelationships = useCallback(() => {
    useIntelligenceEngine.getState().confirmAllRelationships();
  }, []);

  const dismissRelationship = useCallback((suggestionId: string) => {
    useIntelligenceEngine.getState().dismissRelationship(suggestionId);
  }, []);

  return {
    isNewDialogOpen,
    setIsNewDialogOpen,
    isMobileDrawerOpen,
    setIsMobileDrawerOpen,
    activeDraft,
    handleRestoreDraft,
    handleDismissDraft,
    greeting,
    handleOpenProject,
    handleMergeClick,
    duplicates,
    relationshipSuggestions,
    totalInsightsCount,
    dismissDuplicate,
    confirmRelationship,
    confirmAllRelationships,
    dismissRelationship,
  };
}
