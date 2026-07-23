export class ExecutionGuard {
  public static guard(action: string): boolean {
    console.log(`[ExecutionGuard] Guarding: ${action}`);
    return true;
  }
}
