export class PluginHost {
  public static async execute(pluginId: string, action: string): Promise<void> {
    console.log(`[PluginHost] Executing ${action} in ${pluginId}`);
  }
}
