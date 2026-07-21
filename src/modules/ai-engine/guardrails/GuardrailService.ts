import { GuardrailRequestContext, GuardrailResult } from './GuardrailTypes';
import { guardrailEngine } from './GuardrailEngine';

export class GuardrailService {
  public async processRequest(context: GuardrailRequestContext, prompt: string): Promise<GuardrailResult> {
    return await guardrailEngine.validateRequest(context, prompt);
  }
}

export const guardrailService = new GuardrailService();
