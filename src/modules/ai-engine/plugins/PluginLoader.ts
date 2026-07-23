export class PluginLoader {
  public static async load(manifest: any): Promise<any> {
    console.log(`[PluginLoader] Loading plugin: ${manifest.id}`);
    return {};
  }
}
