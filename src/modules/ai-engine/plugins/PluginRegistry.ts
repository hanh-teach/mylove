export class PluginRegistry {
  private static plugins: Map<string, any> = new Map();

  public static register(plugin: any): void {
    console.log(`[PluginRegistry] Registering plugin: ${plugin.id}`);
    this.plugins.set(plugin.id, plugin);
  }

  public static get(id: string): any {
    return this.plugins.get(id);
  }
}
