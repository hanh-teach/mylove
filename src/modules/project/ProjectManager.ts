import { Project, ProjectStatus } from './ProjectModel';
import { projectStore } from './ProjectStore';

export interface ProjectSortOptions {
  field: 'createdAt' | 'updatedAt' | 'title';
  direction: 'asc' | 'desc';
}

export interface ProjectFilterOptions {
  status?: ProjectStatus;
  favorite?: boolean;
  tags?: string[];
}

export class ProjectManager {
  
  public createProject(workspaceId: string, data: Partial<Project>): Project {
    const newProject: Project = {
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      workspaceId,
      title: data.title || 'Untitled Project',
      description: data.description || '',
      thumbnail: data.thumbnail || '',
      cover: data.cover || '',
      status: data.status || 'draft',
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      favorite: data.favorite || false,
      tags: data.tags || [],
      theme: data.theme || {},
      metadata: data.metadata || {},
    };
    
    projectStore.addProject(newProject);
    return newProject;
  }

  public deleteProject(id: string): void {
    projectStore.removeProject(id);
  }

  public duplicateProject(id: string): Project | null {
    const existing = projectStore.getProject(id);
    if (!existing) return null;

    const duplicated: Project = {
      ...existing,
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: `${existing.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
    };
    
    projectStore.addProject(duplicated);
    return duplicated;
  }

  public renameProject(id: string, newTitle: string): void {
    projectStore.updateProject(id, { title: newTitle });
  }

  public archiveProject(id: string): void {
    projectStore.updateProject(id, { status: 'archived' });
  }

  public restoreProject(id: string): void {
    projectStore.updateProject(id, { status: 'draft' });
  }

  public toggleFavorite(id: string): void {
    const existing = projectStore.getProject(id);
    if (existing) {
      projectStore.updateProject(id, { favorite: !existing.favorite });
    }
  }

  public searchProjects(workspaceId: string, query: string): Project[] {
    const lowerQuery = query.toLowerCase();
    const projects = projectStore.getProjects(workspaceId);
    return projects.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery)
    );
  }

  public filterProjects(workspaceId: string, options: ProjectFilterOptions): Project[] {
    let projects = projectStore.getProjects(workspaceId);

    if (options.status) {
      projects = projects.filter(p => p.status === options.status);
    }
    if (options.favorite !== undefined) {
      projects = projects.filter(p => p.favorite === options.favorite);
    }
    if (options.tags && options.tags.length > 0) {
      projects = projects.filter(p => 
        options.tags!.some(tag => p.tags.includes(tag))
      );
    }

    return projects;
  }

  public sortProjects(projects: Project[], options: ProjectSortOptions): Project[] {
    return [...projects].sort((a, b) => {
      const fieldA = a[options.field];
      const fieldB = b[options.field];

      if (fieldA < fieldB) return options.direction === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return options.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  public getWorkspaceProjects(
    workspaceId: string,
    query?: string,
    filter?: ProjectFilterOptions,
    sort?: ProjectSortOptions
  ): Project[] {
    let results = projectStore.getProjects(workspaceId);
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(p => 
        p.title.toLowerCase().includes(lowerQuery) || 
        p.description.toLowerCase().includes(lowerQuery)
      );
    }

    if (filter) {
      if (filter.status) results = results.filter(p => p.status === filter.status);
      if (filter.favorite !== undefined) results = results.filter(p => p.favorite === filter.favorite);
      if (filter.tags && filter.tags.length > 0) {
        results = results.filter(p => filter.tags!.some(tag => p.tags.includes(tag)));
      }
    }

    if (sort) {
      results = this.sortProjects(results, sort);
    }

    return results;
  }
}

export const projectManager = new ProjectManager();
