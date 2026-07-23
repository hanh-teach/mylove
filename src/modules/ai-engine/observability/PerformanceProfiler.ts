export class PerformanceProfiler {
  public static profile(task: string, action: () => any): any {
    const start = Date.now();
    const result = action();
    console.log(`[PerformanceProfiler] ${task} took ${Date.now() - start}ms`);
    return result;
  }
}
