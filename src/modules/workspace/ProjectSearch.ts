import { Project } from './Project';

export class ProjectSearch {
  public static search(projects: Project[], query: string): Project[] {
    if (!query || query.trim() === '') return projects;
    const q = query.toLowerCase().trim();
    return projects.filter((p) => {
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q));
      const matchMessage = p.content?.message?.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchCategory || matchTags || matchMessage;
    });
  }
}
