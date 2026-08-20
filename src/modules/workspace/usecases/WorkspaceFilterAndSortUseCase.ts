import { projectService } from '../ProjectService';
import { Project } from '../Project';
import { SortField, SortDirection } from '../ProjectSorter';
import { WorkspaceViewType } from '../WorkspaceContext';

export class WorkspaceFilterAndSortUseCase {
  static execute(
    activeView: WorkspaceViewType,
    searchQuery: string,
    sortBy: SortField,
    sortDirection: SortDirection,
    categoryFilter: string
  ): Project[] {
    return projectService.filterAndSort(
      activeView,
      searchQuery,
      sortBy,
      sortDirection,
      categoryFilter
    );
  }
}
