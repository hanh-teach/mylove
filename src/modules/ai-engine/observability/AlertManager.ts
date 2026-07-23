export class AlertManager {
  public static raise(alert: string): void {
    console.log(`[AlertManager] ALERT: ${alert}`);
  }
}
