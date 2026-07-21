import { intentAnalyzer } from './IntentAnalyzer';
import { IntentModel } from './IntentModel';

export class IntentService {
  public async getResolvedIntent(userGoal: string): Promise<IntentModel> {
    return await intentAnalyzer.analyze(userGoal);
  }
}

export const intentService = new IntentService();
