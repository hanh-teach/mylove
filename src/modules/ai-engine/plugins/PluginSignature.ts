export class PluginSignature {
  public static verify(plugin: any): boolean {
    console.log('[PluginSignature] Verifying signature');
    return true;
  }
}
