import { useState, useCallback } from 'react';
import { Project } from '../Project';
import { ProjectDashboardActionsUseCase } from '../usecases/ProjectDashboardActionsUseCase';

export function useProjectDashboardBusiness(
  project: Project,
  onNavigateToModule: (module: string) => void,
  onUpdateProject: (updates: Partial<Project>) => void
) {
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleInsightAction = useCallback(
    (category: string) => {
      switch (category) {
        case 'content':
          onNavigateToModule('editor');
          break;
        case 'media':
          onNavigateToModule('assets');
          break;
        case 'timeline':
          onNavigateToModule('timeline');
          break;
        case 'quality':
        default:
          onNavigateToModule('aistudio');
          break;
      }
    },
    [onNavigateToModule]
  );

  const toggleChecklist = useCallback(
    (itemId: string) => {
      const updates = ProjectDashboardActionsUseCase.toggleChecklist(project, itemId);
      onUpdateProject(updates);
    },
    [project, onUpdateProject]
  );

  const togglePriority = useCallback(
    (taskId: string) => {
      const updates = ProjectDashboardActionsUseCase.togglePriorityTask(project, taskId);
      onUpdateProject(updates);
    },
    [project, onUpdateProject]
  );

  const handleSaveAsTemplate = useCallback(() => {
    ProjectDashboardActionsUseCase.createCustomTemplate(project);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  }, [project]);

  return {
    showSaveSuccess,
    handleInsightAction,
    toggleChecklist,
    togglePriority,
    handleSaveAsTemplate,
  };
}
