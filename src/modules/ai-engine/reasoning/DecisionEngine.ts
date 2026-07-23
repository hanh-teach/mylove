import { GoalAnalyzer, UserGoal } from './GoalAnalyzer';
import { ConstraintResolver, Constraints } from './ConstraintResolver';
import { ConflictDetector } from './ConflictDetector';
import { DecisionScorer, DecisionOption, ScoredOption } from './DecisionScorer';
import { ReasonTrace } from './ReasonTrace';
import { knowledgeEventBus } from '../knowledge/KnowledgeEvents'; // Reusing event bus for now, or create reasoning bus

export class DecisionEngine {
  public static decide(
    goal: UserGoal, 
    options: DecisionOption[], 
    constraintsInput?: Constraints
  ): { selected: ScoredOption, trace: ReasonTrace } {
    
    // Emit reasoning started
    console.log('[ReasoningEngine] REASONING_STARTED for goal:', goal.text);

    // 1. Analyze Goal
    const analysis = GoalAnalyzer.analyze(goal);
    
    // 2. Resolve Constraints
    const constraints = ConstraintResolver.resolve(constraintsInput);
    
    // 3. Detect Conflicts
    const conflicts = ConflictDetector.detect(analysis, constraints);
    
    if (conflicts.hasConflict) {
      console.warn('[ReasoningEngine] Conflict Detected:', conflicts.conflicts);
      // In a real system, we might alter options or trigger a replan
    }

    // Emit options generated
    console.log('[ReasoningEngine] OPTION_GENERATED', options.length, 'options');

    // 4. Score Options
    const scoredOptions = DecisionScorer.score(options, constraints.budget, constraints.timeMs);

    if (scoredOptions.length === 0) {
      throw new Error('No valid decision options available.');
    }

    const selected = scoredOptions[0];
    
    // 5. Build Trace
    const trace = new ReasonTrace({
      decisionId: `dec-${Date.now()}`,
      goal: goal.text,
      analysis,
      constraints,
      conflicts,
      selectedOption: selected,
      alternatives: scoredOptions.slice(1),
      confidence: selected.score / 140 // Normalize somewhat
    });

    // Emit decision
    console.log('[ReasoningEngine] DECISION_SELECTED:', selected.name, 'with score', selected.score);
    console.log('[ReasoningEngine] REASONING_COMPLETED');

    return { selected, trace };
  }
}
