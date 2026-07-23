export type PluginCategory = 'theme' | 'ai' | 'export' | 'integration' | 'automation' | 'utility';

export type PluginPermission = 
  | 'memory:read' 
  | 'memory:write' 
  | 'timeline:read' 
  | 'timeline:write' 
  | 'assets:read' 
  | 'assets:write' 
  | 'export' 
  | 'internet';

export interface PluginManifest {
  id: string;
  version: string;
  name: string;
  description: string;
  author: string;
  category: PluginCategory;
  permissions: PluginPermission[];
  icon?: string;
}

export interface PluginInstance {
  manifest: PluginManifest;
  status: 'active' | 'inactive' | 'error';
  grantedPermissions: PluginPermission[];
  installedAt: number;
  lastUpdated: number;
  signatureValid: boolean;
}

export interface PluginRegistry {
  availablePlugins: PluginManifest[];
  installedPlugins: PluginInstance[];
}
