export type GuardrailDecision = 
  | 'ALLOW'
  | 'WARN'
  | 'MASK'
  | 'SANITIZE'
  | 'RETRY'
  | 'FALLBACK'
  | 'BLOCK'
  | 'ESCALATE';

export interface GuardrailRequestContext {
  traceId: string;
  projectId?: string;
  workspaceId?: string;
  userId?: string;
  sceneId?: string;
  role?: 'free' | 'premium' | 'enterprise' | 'admin' | 'guest';
  ip?: string;
  provider?: string;
  model?: string;
}

export interface GuardrailResult {
  decision: GuardrailDecision;
  riskScore: number;
  sanitizedPrompt?: string;
  maskedPrompt?: string;
  violations: string[];
  metadata: Record<string, any>;
}

export interface RiskFactor {
  category: string;
  score: number;
  description: string;
}
