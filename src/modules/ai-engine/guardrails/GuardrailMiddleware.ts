import { GuardrailRequestContext, GuardrailResult } from './GuardrailTypes';
import { guardrailService } from './GuardrailService';

export const guardrailMiddleware = async (
  context: GuardrailRequestContext, 
  prompt: string,
  next: () => Promise<any>
) => {
  const result = await guardrailService.processRequest(context, prompt);
  
  if (result.decision === 'BLOCK') {
    throw new Error('Request blocked by guardrails');
  }
  
  return await next();
};
