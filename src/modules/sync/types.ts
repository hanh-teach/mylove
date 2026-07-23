export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'conflict' | 'error';

export interface SyncState {
  status: SyncStatus;
  lastSyncedAt: number;
  pendingChanges: number;
}

export interface Device {
  id: string;
  name: string;
  type: 'windows' | 'android' | 'tablet' | 'web';
  lastActive: number;
  status: 'online' | 'offline';
  isCurrentDevice: boolean;
}

export interface SyncConflict {
  id: string;
  projectId: string;
  targetId: string; // the memory, asset or content id
  targetType: 'content' | 'memory' | 'asset' | 'timeline' | 'metadata';
  localVersion: any;
  remoteVersion: any;
  remoteDeviceName: string;
  timestamp: number;
  resolved: boolean;
}

export interface BackupSnapshot {
  id: string;
  name: string;
  timestamp: number;
  size: number; // in bytes
  type: 'auto' | 'manual';
  device: string;
}

export interface SyncSettings {
  autoSync: boolean;
  syncOnCellular: boolean;
  selectiveSync: {
    currentProject: boolean;
    favorites: boolean;
    recent: boolean;
    archive: boolean;
  };
}
