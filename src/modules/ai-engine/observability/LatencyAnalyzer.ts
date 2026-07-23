export class LatencyAnalyzer {
  public static analyze(start: number, end: number): number {
    return end - start;
  }
}
