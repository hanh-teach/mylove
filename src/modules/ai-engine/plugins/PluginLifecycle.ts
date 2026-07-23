export class PluginLifecycle {
  public static async activate(id: string): Promise<void> {
    console.log(`[PluginLifecycle] Activating plugin: ${id}`);
  }

  public static async deactivate(id: string): Promise<void> {
    console.log(`[PluginLifecycle] Deactivating plugin: ${id}`);
  }
}
