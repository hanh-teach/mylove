export class PolicyAudit {
  public static log(entry: any): void {
    console.log(`[PolicyAudit] Logging: ${JSON.stringify(entry)}`);
  }
}
