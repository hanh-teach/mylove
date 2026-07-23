export class ProviderTelemetry {
  public static report(id: string, event: string): void {
    console.log(`[ProviderTelemetry] Reporting: ${event} for ${id}`);
  }
}
