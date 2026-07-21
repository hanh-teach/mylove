import { GuardrailRequestContext, GuardrailResult } from './GuardrailTypes';
import { policyEngine } from './PolicyEngine';
import { decisionEngine } from './DecisionEngine';
import { promptSanitizer } from './PromptSanitizer';

export class GuardrailEngine {
  public async validateRequest(context: GuardrailRequestContext, prompt: string): Promise<GuardrailResult> {
    // 1. Sanitize
    const sanitizedPrompt = promptSanitizer.sanitize(prompt);
    
    // 2. Evaluate Policies
    const policies = policyEngine.evaluate(context);
    
    // 3. Make Decision
    return decisionEngine.decide(context, sanitizedPrompt, policies);
  }
}

export const guardrailEngine = new GuardrailEngine();
