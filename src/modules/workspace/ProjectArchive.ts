import { Project } from './Project';

export class ProjectArchive {
  public static filterArchived(projects: Project[]): Project[] {
    return projects.filter((p) => p.status === 'archived');
  }

  public static archive(projects: Project[], id: string): Project[] {
    return projects.map((p) => {
      if (p.id === id) {
        return { ...p, status: 'archived', updatedAt: Date.now() };
      }
      return p;
    });
  }

  public static unarchive(projects: Project[], id: string): Project[] {
    return projects.map((p) => {
      if (p.id === id) {
        return { ...p, status: 'draft', updatedAt: Date.now() };
      }
      return p;
    });
  }
}
