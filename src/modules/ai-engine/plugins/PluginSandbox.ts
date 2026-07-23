export class PluginSandbox {
  public static execute(action: () => Promise<any>): Promise<any> {
    console.log('[PluginSandbox] Executing in sandbox');
    return action();
  }
}
