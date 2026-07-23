export class PluginInstaller {
  public static async install(id: string): Promise<void> {
    console.log(`[PluginInstaller] Installing plugin: ${id}`);
  }
}
