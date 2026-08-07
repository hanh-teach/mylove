import { projectService } from '../ProjectService';
import { Project, ProjectTemplate } from '../Project';

export class CreateWorkspaceProjectUseCase {
  static execute(
    title: string,
    template?: ProjectTemplate,
    category?: string,
    themeColor?: string,
    icon?: string,
    description?: string
  ): Project {
    return projectService.createProject(title, template, category, themeColor, icon, description);
  }
}
