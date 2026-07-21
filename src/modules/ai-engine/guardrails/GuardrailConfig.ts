export interface GuardrailConfig {
  maxPromptLength: number;
  blockThreshold: number; // Risk score to BLOCK (e.g. 80)
  warnThreshold: number;  // Risk score to WARN (e.g. 50)
  enablePII: boolean;
  enableJailbreak: boolean;
  enablePromptInjection: boolean;
  enableContentSafety: boolean;
  rateLimitRPM: number;
}

export const defaultGuardrailConfig: GuardrailConfig = {
  maxPromptLength: 8192,
  blockThreshold: 80,
  warnThreshold: 50,
  enablePII: true,
  enableJailbreak: true,
  enablePromptInjection: true,
  enableContentSafety: true,
  rateLimitRPM: 60,
};
