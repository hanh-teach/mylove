import { SyncState, SyncStatus, Device, SyncConflict, BackupSnapshot, SyncSettings } from './types';

class SyncService {
  private state: SyncState = {
    status: 'synced',
    lastSyncedAt: Date.now(),
    pendingChanges: 0,
  };

  private devices: Device[] = [
    {
      id: 'dev_1',
      name: 'Windows PC (Work)',
      type: 'windows',
      lastActive: Date.now(),
      status: 'online',
      isCurrentDevice: true,
    },
    {
      id: 'dev_2',
      name: 'Galaxy S23',
      type: 'android',
      lastActive: Date.now() - 3600000 * 2,
      status: 'offline',
      isCurrentDevice: false,
    },
    {
      id: 'dev_3',
      name: 'iPad Pro',
      type: 'tablet',
      lastActive: Date.now() - 3600000 * 24,
      status: 'offline',
      isCurrentDevice: false,
    }
  ];

  private backups: BackupSnapshot[] = [
    { id: 'bk_1', name: 'Auto Backup - Before major changes', timestamp: Date.now() - 86400000, size: 1024 * 1024 * 45, type: 'auto', device: 'Windows PC' },
    { id: 'bk_2', name: 'Manual Backup', timestamp: Date.now() - 86400000 * 3, size: 1024 * 1024 * 42, type: 'manual', device: 'Galaxy S23' }
  ];

  private conflicts: SyncConflict[] = [
    {
      id: 'conf_1',
      projectId: 'proj_1',
      targetId: 'content_1',
      targetType: 'content',
      localVersion: { text: 'Ngày hôm đó trời mưa to...' },
      remoteVersion: { text: 'Ngày hôm đó thời tiết khá xấu, mưa tầm tã...' },
      remoteDeviceName: 'Galaxy S23',
      timestamp: Date.now() - 1000 * 60 * 5,
      resolved: false
    }
  ];

  private settings: SyncSettings = {
    autoSync: true,
    syncOnCellular: false,
    selectiveSync: {
      currentProject: true,
      favorites: true,
      recent: true,
      archive: false,
    }
  };

  public getState(): SyncState {
    return this.state;
  }

  public getDevices(): Device[] {
    return this.devices;
  }

  public getBackups(): BackupSnapshot[] {
    return this.backups;
  }

  public getConflicts(): SyncConflict[] {
    return this.conflicts.filter(c => !c.resolved);
  }
  
  public getSettings(): SyncSettings {
    return this.settings;
  }

  public simulateSync() {
    this.state = { ...this.state, status: 'syncing' };
    setTimeout(() => {
      this.state = { status: 'synced', lastSyncedAt: Date.now(), pendingChanges: 0 };
    }, 1500);
  }

  public resolveConflict(conflictId: string, resolution: 'local' | 'remote' | 'merge', mergedContent?: any) {
    const idx = this.conflicts.findIndex(c => c.id === conflictId);
    if (idx !== -1) {
      this.conflicts[idx].resolved = true;
      // In real implementation, apply the resolution
    }
  }

  public removeDevice(deviceId: string) {
    this.devices = this.devices.filter(d => d.id !== deviceId);
  }
  
  public createBackup(name: string) {
    this.backups.unshift({
      id: `bk_${Date.now()}`,
      name,
      timestamp: Date.now(),
      size: 1024 * 1024 * Math.floor(Math.random() * 20 + 30),
      type: 'manual',
      device: 'Windows PC (Work)'
    });
  }
}

export const syncService = new SyncService();
