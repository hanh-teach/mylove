import { ScoredOption } from './DecisionScorer';

export interface ExecutionStrategy {
  type: 'sequential' | 'parallel' | 'hybrid' | 'streaming';
  tasks: string[];
}

export class StrategyBuilder {
  public static build(decision: ScoredOption): ExecutionStrategy {
    // Simple heuristic: if tasks are many and latency is low, try parallel (if they don't depend on each other)
    // For now, we return sequential as default, or parallel if specified in task name/logic.
    
    const isHeavy = decision.tasks.length > 2;
    
    return {
      type: isHeavy ? 'hybrid' : 'sequential',
      tasks: decision.tasks
    };
  }
}
