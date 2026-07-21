export class PolicyCache {
  private cache = new Map();
  public get(key: string) { return this.cache.get(key); }
  public set(key: string, value: any) { this.cache.set(key, value); }
}

export const policyCache = new PolicyCache();
