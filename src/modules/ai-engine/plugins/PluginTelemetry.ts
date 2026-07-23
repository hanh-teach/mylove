export class PluginTelemetry {
  public static report(pluginId: string, event: string): void {
    console.log(`[PluginTelemetry] Reporting: ${event} for ${pluginId}`);
  }
}
