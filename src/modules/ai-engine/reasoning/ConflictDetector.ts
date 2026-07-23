import { GoalAnalysisResult } from './GoalAnalyzer';
import { ResolvedConstraints } from './ConstraintResolver';

export interface ConflictReport {
  hasConflict: boolean;
  conflicts: string[];
  resolutionRecommendation: 'prefer_emotion' | 'prefer_theme' | 'ask_clarification' | 'auto_resolve';
}

export class ConflictDetector {
  public static detect(analysis: GoalAnalysisResult, constraints: ResolvedConstraints): ConflictReport {
    const conflicts: string[] = [];
    let resolution: ConflictReport['resolutionRecommendation'] = 'auto_resolve';

    // Example 1: Theme and Emotion conflict
    if (analysis.theme === 'apology' && analysis.emotion === 'happy') {
      conflicts.push('Style conflict: Apology theme requested with happy emotion.');
      resolution = 'prefer_theme'; // Apologies should probably not be overly happy
    }

    // Example 2: Budget vs Need
    if (constraints.budget < 0.05 && analysis.theme === 'anniversary') {
      conflicts.push('Budget conflict: Anniversary workflows typically require high-quality (expensive) models.');
      resolution = 'ask_clarification';
    }

    // Example 3: Provider mismatch
    if (constraints.provider === 'runway' && analysis.intent === 'text_only') {
      conflicts.push('Provider conflict: Runway is for video, but intent is text_only.');
      resolution = 'auto_resolve';
    }

    return {
      hasConflict: conflicts.length > 0,
      conflicts,
      resolutionRecommendation: resolution
    };
  }
}
