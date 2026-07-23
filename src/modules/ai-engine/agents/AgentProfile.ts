export interface AgentProfile {
  id: string;
  role: string;
  capabilities: string[];
  priority: number;
  permissions: string[];
  status: 'Created' | 'Idle' | 'Busy' | 'Waiting' | 'Failed' | 'Completed' | 'Retired';
  lastHeartbeat: number;
}
