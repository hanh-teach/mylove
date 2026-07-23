import { GoalAnalysisResult } from './GoalAnalyzer';
import { ResolvedConstraints } from './ConstraintResolver';
import { ConflictReport } from './ConflictDetector';
import { ScoredOption } from './DecisionScorer';

export interface ReasonTraceData {
  decisionId: string;
  goal: string;
  analysis: GoalAnalysisResult;
  constraints: ResolvedConstraints;
  conflicts: ConflictReport;
  selectedOption: ScoredOption;
  alternatives: ScoredOption[];
  confidence: number;
}

export class ReasonTrace {
  private data: ReasonTraceData;
  private timestamp: string;

  constructor(data: ReasonTraceData) {
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  public getTrace(): any {
    return {
      timestamp: this.timestamp,
      decisionId: this.data.decisionId,
      why: `Selected '${this.data.selectedOption.name}' because it scored highest (${this.data.selectedOption.score}) based on budget constraints ($${this.data.constraints.budget}) and quality requirements.`,
      confidence: this.data.confidence,
      evidence: {
        analysis: this.data.analysis,
        conflictsResolved: this.data.conflicts.conflicts
      },
      alternativesRejected: this.data.alternatives.map(a => `${a.name} (Score: ${a.score})`),
      cost: this.data.selectedOption.estimatedCostUsd,
      latency: this.data.selectedOption.estimatedLatencyMs
    };
  }

  public log(): void {
    console.log(`[ReasonTrace] Decision ID: ${this.data.decisionId}`);
    console.log(JSON.stringify(this.getTrace(), null, 2));
  }
}
