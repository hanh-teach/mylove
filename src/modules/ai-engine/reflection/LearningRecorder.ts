export class LearningRecorder {
  private static traces: any[] = [];

  public static record(trace: any): void {
    console.log(`[LearningRecorder] Recording trace: ${trace.workflowId}`);
    this.traces.unshift(trace);
    if (this.traces.length > 50) {
      this.traces.pop();
    }
  }

  public static getRecentTraces(): any[] {
    return this.traces;
  }
}

