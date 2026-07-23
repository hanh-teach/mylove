export class HealthMetrics {
  public static report(service: string, status: string): void {
    console.log(`[HealthMetrics] ${service} is ${status}`);
  }
}
