import { ApiKey, Webhook, AuditLogEntry, ApiEndpoint } from './types';

class DeveloperService {
  private apiKeys: ApiKey[] = [
    {
      id: 'key_1',
      name: 'Zapier Integration',
      keyPrefix: 'ln_live_83jf92...',
      createdAt: Date.now() - 86400000 * 30,
      lastUsedAt: Date.now() - 3600000 * 2,
      scopes: ['memory:read', 'memory:write'],
      status: 'active'
    },
    {
      id: 'key_2',
      name: 'Mobile App Test',
      keyPrefix: 'ln_test_992kx1...',
      createdAt: Date.now() - 86400000 * 120,
      lastUsedAt: Date.now() - 86400000 * 90,
      scopes: ['*'],
      status: 'revoked'
    }
  ];

  private webhooks: Webhook[] = [
    {
      id: 'wh_1',
      name: 'Notion Sync',
      url: 'https://api.notion.com/v1/sync...',
      events: ['memory.created', 'memory.updated'],
      active: true,
      createdAt: Date.now() - 86400000 * 15,
      lastTriggeredAt: Date.now() - 1800000,
      secret: 'whsec_93jd82kdjf912kdf'
    }
  ];

  private auditLogs: AuditLogEntry[] = [
    {
      id: 'log_1',
      actorId: 'usr_1',
      actorName: 'Alex Johnson',
      action: 'API_KEY_CREATED',
      resource: 'ApiKey',
      resourceId: 'key_1',
      timestamp: Date.now() - 86400000 * 30,
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'success'
    },
    {
      id: 'log_2',
      actorId: 'usr_1',
      actorName: 'Alex Johnson',
      action: 'MEMORY_EXPORTED',
      resource: 'Memory',
      timestamp: Date.now() - 86400000 * 2,
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'success'
    },
    {
      id: 'log_3',
      actorId: 'key_1',
      actorName: 'Zapier Integration',
      action: 'MEMORY_CREATED',
      resource: 'Memory',
      resourceId: 'mem_193',
      timestamp: Date.now() - 3600000 * 2,
      ipAddress: '34.201.12.93',
      userAgent: 'Zapier-Axios',
      status: 'success'
    }
  ];

  private endpoints: ApiEndpoint[] = [
    { method: 'GET', path: '/v1/memories', summary: 'List all memories', category: 'Memory', version: 'v1' },
    { method: 'POST', path: '/v1/memories', summary: 'Create a new memory', category: 'Memory', version: 'v1' },
    { method: 'GET', path: '/v1/memories/:id', summary: 'Get memory by ID', category: 'Memory', version: 'v1' },
    { method: 'GET', path: '/v1/projects', summary: 'List all projects', category: 'Project', version: 'v1' },
    { method: 'POST', path: '/v1/webhooks', summary: 'Register a webhook', category: 'Webhook', version: 'v1' }
  ];

  public getApiKeys(): ApiKey[] {
    return this.apiKeys;
  }

  public getWebhooks(): Webhook[] {
    return this.webhooks;
  }

  public getAuditLogs(): AuditLogEntry[] {
    return this.auditLogs;
  }

  public getEndpoints(): ApiEndpoint[] {
    return this.endpoints;
  }
}

export const developerService = new DeveloperService();
