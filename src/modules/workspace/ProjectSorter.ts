import { Project } from './Project';

export type SortField = 'date' | 'name' | 'category' | 'recent';
export type SortDirection = 'asc' | 'desc';

export class ProjectSorter {
  public static sort(
    projects: Project[],
    field: SortField = 'date',
    direction: SortDirection = 'desc'
  ): Project[] {
    return [...projects].sort((a, b) => {
      let comparison = 0;
      switch (field) {
        case 'date':
        case 'recent':
          comparison = b.updatedAt - a.updatedAt;
          break;
        case 'name':
          comparison = a.title.localeCompare(b.title, 'vi');
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category, 'vi');
          break;
        default:
          comparison = b.updatedAt - a.updatedAt;
      }

      return direction === 'asc' ? -comparison : comparison;
    });
  }
}
