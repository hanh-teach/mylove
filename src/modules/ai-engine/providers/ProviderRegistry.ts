export class ProviderRegistry {
  private static providers: Map<string, any> = new Map();

  public static register(provider: any): void {
    console.log(`[ProviderRegistry] Registering: ${provider.id}`);
    this.providers.set(provider.id, provider);
  }

  public static get(id: string): any {
    return this.providers.get(id);
  }
}
