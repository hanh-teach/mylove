import { Project } from './Project';

export class ProjectFavorites {
  public static filterFavorites(projects: Project[]): Project[] {
    return projects.filter((p) => p.favorite && p.status !== 'trash');
  }

  public static toggleFavorite(projects: Project[], id: string): Project[] {
    return projects.map((p) => {
      if (p.id === id) {
        return { ...p, favorite: !p.favorite, updatedAt: Date.now() };
      }
      return p;
    });
  }
}
