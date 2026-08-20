import { WorkspaceService, workspaceService } from '../WorkspaceService';
import { Workspace } from '../Workspace';

export class LoadWorkspaceUseCase {
  static async execute(userId: string): Promise<Workspace[]> {
    return await workspaceService.fetchUserWorkspaces(userId);
  }
}
