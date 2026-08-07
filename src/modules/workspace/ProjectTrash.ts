import { Project } from './Project';

export class ProjectTrash {
  public static filterTrashed(projects: Project[]): Project[] {
    return projects.filter((p) => p.status === 'trash');
  }

  public static moveToTrash(projects: Project[], id: string): Project[] {
    return projects.map((p) => {
      if (p.id === id) {
        return { ...p, status: 'trash', updatedAt: Date.now() };
      }
      return p;
    });
  }

  public static restoreFromTrash(projects: Project[], id: string): Project[] {
    return projects.map((p) => {
      if (p.id === id) {
        return { ...p, status: 'draft', updatedAt: Date.now() };
      }
      return p;
    });
  }

  public static permanentlyDelete(projects: Project[], id: string): Project[] {
    return projects.filter((p) => p.id !== id);
  }

  public static emptyTrash(projects: Project[]): Project[] {
    return projects.filter((p) => p.status !== 'trash');
  }
}
