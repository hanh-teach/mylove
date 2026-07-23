import React, { useState, useEffect } from 'react';
import { Typography } from '../../components/ui/Typography';
import { Check, Cloud, Wifi, Cpu, Layers, RefreshCw, AlertTriangle } from 'lucide-react';
import { syncService } from '../../modules/sync/SyncService';

export const StatusBar: React.FC = () => {
  const [syncState, setSyncState] = useState(syncService.getState());
  
  useEffect(() => {
    // In real app, we would subscribe to syncService events here.
    // For now, let's just poll every few seconds
    const interval = setInterval(() => {
      setSyncState(syncService.getState());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:flex h-8 bg-white border-t border-border-subtle px-4 items-center justify-between text-text-muted z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Check size={12} className="text-emerald-500" />
          <Typography variant="label" className="lowercase">Sẵn sàng</Typography>
        </div>
        
        {/* Sync Status Indicator */}
        <div className="flex items-center gap-1.5">
          {syncState.status === 'synced' && (
            <>
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <Typography variant="label" className="lowercase">Đã đồng bộ</Typography>
            </>
          )}
          {syncState.status === 'syncing' && (
            <>
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <Typography variant="label" className="lowercase">Đang đồng bộ...</Typography>
            </>
          )}
          {syncState.status === 'conflict' && (
            <>
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <Typography variant="label" className="lowercase text-rose-500">Có xung đột</Typography>
            </>
          )}
          {syncState.status === 'offline' && (
            <>
              <div className="w-2 h-2 rounded-full bg-slate-400" />
              <Typography variant="label" className="lowercase">Offline (Lưu cục bộ)</Typography>
            </>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Wifi size={12} />
            <Typography variant="label" className="lowercase">Online</Typography>
          </div>
          <div className="w-px h-3 bg-border-subtle" />
          <div className="flex items-center gap-1">
            <Cpu size={12} />
            <Typography variant="label" className="lowercase">v1.0.0 Stable</Typography>
          </div>
          <div className="w-px h-3 bg-border-subtle" />
          <div className="flex items-center gap-1">
            <Layers size={12} />
            <Typography variant="label" className="lowercase">LPCP 1.0 (Production Ready)</Typography>
          </div>
        </div>
      </div>
    </div>
  );
};
