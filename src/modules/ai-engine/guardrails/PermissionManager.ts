export class PermissionManager {
  public hasPermission(role: string, action: string): boolean {
    return true;
  }
}

export const permissionManager = new PermissionManager();
