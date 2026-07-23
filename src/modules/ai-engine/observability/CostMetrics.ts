export class CostMetrics {
  public static track(cost: number): void {
    console.log(`[CostMetrics] Cost incurred: ${cost}`);
  }
}
