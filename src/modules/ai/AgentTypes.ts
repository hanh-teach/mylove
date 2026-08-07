export type TaskStatus = 'pending' | 'running' | 'waiting_approval' | 'completed' | 'failed' | 'cancelled';

export type PermissionType = 'read_memory' | 'write_memory' | 'read_timeline' | 'write_timeline' | 'read_draft' | 'write_draft' | 'read_assets' | 'export_pdf' | 'share';

export interface IAgentPermission {
  type: PermissionType;
  allowed: boolean;
  description: string;
}

export interface ITask {
  id: string;
  planId: string;
  title: string;
  description: string;
  status: TaskStatus;
  tool?: string;
  result?: any;
  error?: string;
  proposedChanges?: IProposedChange[];
  createdAt: string;
  updatedAt: string;
}

export interface IProposedChange {
  id: string;
  type: 'add' | 'edit' | 'delete';
  entityType: 'memory' | 'timeline' | 'draft' | 'asset' | 'project' | 'knowledge';
  entityId?: string;
  originalData?: any;
  newData?: any;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface IPlan {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'failed' | 'cancelled';
  tasks: ITask[];
  createdAt: string;
  updatedAt: string;
}

export interface IAgentActivity {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  planId?: string;
  taskId?: string;
  level: 'info' | 'success' | 'warning' | 'error';
}
