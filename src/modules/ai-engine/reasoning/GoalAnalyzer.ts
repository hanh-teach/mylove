export interface UserGoal {
  text: string;
  userId?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface GoalAnalysisResult {
  intent: string;
  emotion: string;
  theme: string;
  priority: string;
  constraints: string[];
}

export class GoalAnalyzer {
  public static analyze(goal: UserGoal): GoalAnalysisResult {
    // In a real scenario, this might use an LLM or specialized classifier.
    // Here we provide heuristic-based mock analysis.
    
    const textLower = goal.text.toLowerCase();
    
    let emotion = 'neutral';
    if (textLower.match(/(sad|cry|miss|alone|heartbreak)/)) emotion = 'sad';
    else if (textLower.match(/(happy|joy|smile|laugh|excited)/)) emotion = 'happy';
    else if (textLower.match(/(love|romance|sweet|kiss|hug)/)) emotion = 'romantic';
    else if (textLower.match(/(angry|mad|furious)/)) emotion = 'angry';

    let theme = 'general';
    if (textLower.includes('anniversary')) theme = 'anniversary';
    else if (textLower.includes('birthday')) theme = 'birthday';
    else if (textLower.includes('apology')) theme = 'apology';
    
    return {
      intent: 'generate_content', // Simplified intent
      emotion,
      theme,
      priority: goal.priority || 'medium',
      constraints: []
    };
  }
}
