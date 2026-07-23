export class PolicyRegistry {
  public static register(name: string, policy: any): void {
    console.log(`[PolicyRegistry] Registering: ${name}`);
  }
}
