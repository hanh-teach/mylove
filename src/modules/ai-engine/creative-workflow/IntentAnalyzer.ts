import { IntentModel, WorkflowType } from './IntentModel';

export class IntentAnalyzer {
  public async analyze(userGoal: string): Promise<IntentModel> {
    // Basic implementation using pattern matching to identify intents
    const intent: IntentModel = {
      requiredWorkflows: ['love-note'], // Default
      metadata: {}
    };

    if (userGoal.includes('yêu nhau') || userGoal.includes('anniversary')) {
      intent.occasion = 'Anniversary';
      intent.theme = 'Romantic';
      intent.requiredWorkflows = ['love-note', 'album', 'video', 'website'];
    }

    if (userGoal.includes('sinh nhật')) {
      intent.occasion = 'Birthday';
      intent.theme = 'Celebration';
      intent.requiredWorkflows = ['album', 'story'];
    }

    // Set default emotion/style if not detected
    intent.emotion = intent.emotion || 'Happy';
    intent.style = intent.style || 'Anime';
    intent.language = intent.language || 'Vietnamese';

    return intent;
  }
}

export const intentAnalyzer = new IntentAnalyzer();
