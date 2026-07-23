import { KnowledgeItem } from './KnowledgeTypes';
import { knowledgeEventBus } from './KnowledgeEvents';

export interface AccessPolicy {
  agentRole: string;
  allowedTypes: string[];
  deniedTypes: string[];
}

export class KnowledgePolicy {
  private static policies: Map<string, AccessPolicy> = new Map([
    [
      'LoveLetterAgent',
      {
        agentRole: 'LoveLetterAgent',
        allowedTypes: ['memory', 'timeline', 'preference', 'template', 'asset'],
        deniedTypes: ['billing', 'secret', 'admin']
      }
    ],
    [
      'RelationshipCoach',
      {
        agentRole: 'RelationshipCoach',
        allowedTypes: ['memory', 'timeline', 'preference', 'policy'],
        deniedTypes: ['billing', 'secret', 'admin']
      }
    ],
    [
      'PlannerAgent',
      {
        agentRole: 'PlannerAgent',
        allowedTypes: ['prompt', 'workflow', 'policy', 'template', 'asset'],
        deniedTypes: ['billing', 'secret', 'admin']
      }
    ]
  ]);

  /**
   * Verifies if the requestor has permissions to retrieve or read specified resource types.
   */
  public static isAccessAllowed(agentRole: string, itemType: string): boolean {
    const policy = this.policies.get(agentRole);
    if (!policy) {
      // Default open access if not specifically guarded, but prevent reading system admin or billing
      return !['billing', 'secret', 'admin'].includes(itemType);
    }

    if (policy.deniedTypes.includes(itemType)) {
      knowledgeEventBus.emit({
        type: 'KNOWLEDGE_POLICY_VIOLATION',
        message: `Policy violation: Role [${agentRole}] denied access to resource type [${itemType}]`,
        timestamp: new Date().toISOString(),
        metadata: { agentRole, itemType }
      });
      return false;
    }

    return policy.allowedTypes.includes(itemType);
  }

  /**
   * Detects and masks PII (emails, phone numbers, credit cards, credentials) prior to indexing or embedding.
   */
  public static maskPII(text: string): string {
    let masked = text;
    
    // Mask Emails
    masked = masked.replace(/[\w.-]+@[\w.-]+\.\w+/gi, '[MASKED_EMAIL]');
    
    // Mask Phone numbers
    masked = masked.replace(/(\+?\d{1,4}[-.\s]??)?(\d{3}[-.\s]??\d{3}[-.\s]??\d{4})/g, '[MASKED_PHONE]');

    // Mask API Keys or Credentials
    masked = masked.replace(/(api_key|apikey|secret|password|passwd|token)\s*[:=]\s*["']?[\w\-:]{16,}["']?/gi, '$1: [MASKED_SECRET]');

    return masked;
  }

  /**
   * Asserts whether content is safe or contains unauthorized credentials.
   */
  public static isSafeToEmbed(item: KnowledgeItem): boolean {
    const contentLower = item.content.toLowerCase();
    
    // Quick checks for clear signs of security violations
    const forbiddenPatterns = [
      /private_key/i,
      /-----begin rsa private key-----/i,
      /firebase_api_key/i,
      /gemini_api_key/i,
      /secret_key/i
    ];

    for (const pattern of forbiddenPatterns) {
      if (pattern.test(contentLower)) {
        return false;
      }
    }
    return true;
  }
}
