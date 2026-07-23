import { PluginInstance, PluginManifest, PluginPermission } from './types';

class PluginService {
  private installedPlugins: PluginInstance[] = [
    {
      manifest: {
        id: 'ln.theme.twilight',
        version: '1.2.0',
        name: 'Twilight Theme',
        description: 'A beautiful dark theme optimized for night writing.',
        author: 'LoveNote Design',
        category: 'theme',
        permissions: [],
      },
      status: 'active',
      grantedPermissions: [],
      installedAt: Date.now() - 86400000 * 30,
      lastUpdated: Date.now() - 86400000 * 5,
      signatureValid: true
    },
    {
      manifest: {
        id: 'ln.ai.grammar',
        version: '2.0.1',
        name: 'Grammar Checker',
        description: 'Advanced AI grammar checking and styling suggestions.',
        author: 'LoveNote AI',
        category: 'ai',
        permissions: ['memory:read', 'internet'],
      },
      status: 'active',
      grantedPermissions: ['memory:read', 'internet'],
      installedAt: Date.now() - 86400000 * 10,
      lastUpdated: Date.now() - 86400000 * 1,
      signatureValid: true
    },
    {
      manifest: {
        id: 'ext.integration.gdrive',
        version: '1.0.5',
        name: 'Google Drive Sync',
        description: 'Backup and sync your memories with Google Drive.',
        author: 'CloudTools Inc.',
        category: 'integration',
        permissions: ['memory:read', 'assets:read', 'export', 'internet'],
      },
      status: 'inactive',
      grantedPermissions: ['memory:read', 'assets:read', 'export'],
      installedAt: Date.now() - 86400000 * 2,
      lastUpdated: Date.now() - 86400000 * 2,
      signatureValid: true
    }
  ];

  private availablePlugins: PluginManifest[] = [
    {
      id: 'ext.ai.storyplanner',
      version: '1.0.0',
      name: 'Story Planner AI',
      description: 'Helps structure narratives and outline timelines.',
      author: 'CreativeMinds',
      category: 'ai',
      permissions: ['timeline:read', 'timeline:write', 'internet']
    },
    {
      id: 'ext.export.advanced_pdf',
      version: '1.5.0',
      name: 'Advanced PDF Export',
      description: 'Customizable PDF templates for printing memories.',
      author: 'PrintPro',
      category: 'export',
      permissions: ['memory:read', 'assets:read', 'export']
    }
  ];

  public getInstalledPlugins(): PluginInstance[] {
    return this.installedPlugins;
  }

  public getAvailablePlugins(): PluginManifest[] {
    return this.availablePlugins;
  }

  public togglePlugin(id: string, active: boolean) {
    const plugin = this.installedPlugins.find(p => p.manifest.id === id);
    if (plugin) {
      plugin.status = active ? 'active' : 'inactive';
    }
  }

  public uninstallPlugin(id: string) {
    this.installedPlugins = this.installedPlugins.filter(p => p.manifest.id !== id);
  }

  public installPlugin(manifest: PluginManifest, grantedPermissions: PluginPermission[]) {
    this.installedPlugins.unshift({
      manifest,
      status: 'active',
      grantedPermissions,
      installedAt: Date.now(),
      lastUpdated: Date.now(),
      signatureValid: true
    });
    this.availablePlugins = this.availablePlugins.filter(p => p.id !== manifest.id);
  }
}

export const pluginService = new PluginService();
