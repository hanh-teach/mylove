import { SyncState, SyncStatus, Device, SyncConflict, BackupSnapshot, SyncSettings } from './types';

class SyncService {
  private listeners: Set<() => void> = new Set();

  private state: SyncState = {
    status: 'synced',
    lastSyncedAt: Date.now(),
    pendingChanges: 0,
    isOnline: true,
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
    { 
      id: 'bk_1', 
      name: 'Auto Backup - Before major changes', 
      note: 'Sao lưu tự động đám mây v1.1',
      timestamp: Date.now() - 86400000, 
      size: 1024 * 1024 * 45, 
      type: 'auto', 
      device: 'Windows PC (Work)' 
    },
    { 
      id: 'bk_2', 
      name: 'Manual Backup - Kỉ niệm 3 năm', 
      note: 'Lưu phiên bản hoàn chỉnh thiệp video',
      timestamp: Date.now() - 86400000 * 3, 
      size: 1024 * 1024 * 42, 
      type: 'manual', 
      device: 'Galaxy S23' 
    }
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

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

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

  public toggleOnlineMode() {
    const nextOnline = !this.state.isOnline;
    this.state = {
      ...this.state,
      isOnline: nextOnline,
      status: nextOnline ? (this.state.pendingChanges > 0 ? 'syncing' : 'synced') : 'offline'
    };

    if (nextOnline && this.state.pendingChanges > 0) {
      this.simulateSync();
    } else {
      this.notify();
    }
  }

  public simulateSync() {
    if (!this.state.isOnline) return;
    this.state = { ...this.state, status: 'syncing' };
    this.notify();

    setTimeout(() => {
      this.state = { 
        ...this.state,
        status: 'synced', 
        lastSyncedAt: Date.now(), 
        pendingChanges: 0 
      };
      this.notify();
    }, 1200);
  }

  public triggerAutoSave(changeCount = 1) {
    if (!this.state.isOnline) {
      this.state = {
        ...this.state,
        pendingChanges: this.state.pendingChanges + changeCount,
        status: 'offline'
      };
      this.notify();
      return;
    }

    this.state = {
      ...this.state,
      pendingChanges: this.state.pendingChanges + changeCount,
      status: 'syncing'
    };
    this.notify();

    setTimeout(() => {
      this.state = {
        ...this.state,
        status: 'synced',
        lastSyncedAt: Date.now(),
        pendingChanges: 0
      };
      this.notify();
    }, 1000);
  }

  public resolveConflict(conflictId: string, resolution: 'local' | 'remote' | 'merge', mergedContent?: any) {
    const idx = this.conflicts.findIndex(c => c.id === conflictId);
    if (idx !== -1) {
      this.conflicts[idx].resolved = true;
      this.notify();
    }
  }

  public removeDevice(deviceId: string) {
    this.devices = this.devices.filter(d => d.id !== deviceId);
    this.notify();
  }
  
  public createBackup(name: string, note?: string, dataSnapshot?: any, type: 'auto' | 'manual' | 'pre-export' = 'manual'): BackupSnapshot {
    const currentDevice = this.devices.find(d => d.isCurrentDevice)?.name || 'Windows PC (Work)';
    const newBackup: BackupSnapshot = {
      id: `bk_${Date.now()}`,
      name,
      note,
      timestamp: Date.now(),
      size: 1024 * 1024 * Math.floor(Math.random() * 20 + 30),
      type,
      device: currentDevice,
      dataSnapshot
    };
    this.backups.unshift(newBackup);
    this.notify();
    return newBackup;
  }

  public deleteBackup(backupId: string) {
    this.backups = this.backups.filter(b => b.id !== backupId);
    this.notify();
  }

  public restoreBackup(backupId: string): BackupSnapshot | undefined {
    const target = this.backups.find(b => b.id === backupId);
    if (target) {
      this.simulateSync();
      return target;
    }
    return undefined;
  }
}

export const syncService = new SyncService();
