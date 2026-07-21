export type PolicyType = 'security' | 'cost' | 'usage' | 'provider';

export interface PolicyCondition {
  key: string;
  operator: 'equals' | 'greaterThan' | 'lessThan' | 'contains';
  value: any;
}

export interface PolicyAction {
  type: 'ALLOW' | 'BLOCK' | 'WARN' | 'MASK' | 'RETRY' | 'FALLBACK';
  params?: Record<string, any>;
}

export interface PolicyDefinition {
  id: string;
  name: string;
  description: string;
  type: PolicyType;
  priority: number;
  enabled: boolean;
  conditions: PolicyCondition[];
  actions: PolicyAction[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: number;
  updatedAt: number;
  version: string;
  metadata: Record<string, any>;
}
