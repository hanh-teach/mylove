export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: number;
  expiresAt?: number | null;
  lastUsedAt?: number | null;
  scopes: string[];
  status: 'active' | 'revoked' | 'expired';
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: number;
  lastTriggeredAt?: number | null;
  secret: string;
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  resource: string;
  resourceId?: string;
  timestamp: number;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure';
  details?: Record<string, any>;
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  summary: string;
  category: string;
  version: string;
}
