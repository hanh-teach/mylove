export class TelemetryCollector {
  public static record(event: any): void {
    console.log(`[TelemetryCollector] Recording event: ${event.type}`);
  }
}
