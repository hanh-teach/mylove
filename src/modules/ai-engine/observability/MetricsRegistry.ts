export class MetricsRegistry {
  public static increment(name: string): void {
    console.log(`[MetricsRegistry] Incrementing: ${name}`);
  }
}
