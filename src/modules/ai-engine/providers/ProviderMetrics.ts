export class ProviderMetrics {
  public static record(id: string, metric: any): void {
    console.log(`[ProviderMetrics] Recording for ${id}`);
  }
}
