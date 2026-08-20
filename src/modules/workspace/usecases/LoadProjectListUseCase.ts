import { projectService } from '../ProjectService';
import { Project } from '../Project';

export class LoadProjectListUseCase {
  static getProjects(): Project[] {
    return projectService.getProjects();
  }

  static getActiveProject(): Project | null {
    return projectService.getActiveProject() || null;
  }
}
