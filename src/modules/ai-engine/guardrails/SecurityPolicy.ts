export class SecurityPolicy {
  public isSecure(prompt: string): boolean {
    return true;
  }
}

export const securityPolicy = new SecurityPolicy();
