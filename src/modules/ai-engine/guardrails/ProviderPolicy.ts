export class ProviderPolicy {
  public isAllowed(provider: string): boolean {
    return true;
  }
}

export const providerPolicy = new ProviderPolicy();
