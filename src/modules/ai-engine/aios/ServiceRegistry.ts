export class ServiceRegistry {
  public static register(service: string): void {
    console.log(`[ServiceRegistry] Registering: ${service}`);
  }
}
