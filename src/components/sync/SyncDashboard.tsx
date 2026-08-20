import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cloud, CloudOff, Laptop, Smartphone, Tablet, 
  History, AlertTriangle, ShieldCheck, Database, FileText, 
  Settings, CheckCircle2, ChevronRight, Download, Trash2, 
  RefreshCw, SmartphoneNfc, Zap, Lock, Sparkles, Plus, Clock, Tag, User, RotateCcw,
  Check, Wifi, WifiOff
} from 'lucide-react';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { syncService } from '../../modules/sync/SyncService';
import { SyncState, Device, BackupSnapshot, SyncConflict } from '../../modules/sync/types';
import { versionManager } from '../../modules/version/VersionManager';
import { versionStore } from '../../modules/version/VersionStore';
import { ProjectVersion, VersionTag } from '../../modules/version/VersionModel';

export const SyncDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'devices' | 'backups' | 'versions' | 'conflicts'>('overview');
  const [syncState, setSyncState] = useState<SyncState>(syncService.getState());
  const [devices, setDevices] = useState<Device[]>(syncService.getDevices());
  const [backups, setBackups] = useState<BackupSnapshot[]>(syncService.getBackups());
  const [conflicts, setConflicts] = useState<SyncConflict[]>(syncService.getConflicts());
  const [versions, setVersions] = useState<ProjectVersion[]>(versionManager.getHistory('active-project'));
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Backup Modal state
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [newBackupName, setNewBackupName] = useState('');
  const [newBackupNote, setNewBackupNote] = useState('');

  // New Version Modal state
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [newVersionName, setNewVersionName] = useState('');
  const [newVersionTag, setNewVersionTag] = useState<VersionTag>('Milestone');
  const [newVersionDesc, setNewVersionDesc] = useState('');

  useEffect(() => {
    const unsubSync = syncService.subscribe(() => {
      setSyncState(syncService.getState());
      setDevices(syncService.getDevices());
      setBackups(syncService.getBackups());
      setConflicts(syncService.getConflicts());
    });

    const unsubVer = versionStore.subscribe(() => {
      setVersions(versionManager.getHistory('active-project'));
    });

    return () => {
      unsubSync();
      unsubVer();
    };
  }, []);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleManualSync = () => {
    if (!syncState.isOnline) {
      showNotification('⚠️ Đang ở chế độ Offline. Hãy bật Online trước khi đồng bộ.');
      return;
    }
    setIsSyncing(true);
    syncService.simulateSync();
    setTimeout(() => {
      setSyncState(syncService.getState());
      setIsSyncing(false);
      showNotification('✅ Đã hoàn tất đồng bộ dữ liệu với Đám mây!');
    }, 1500);
  };

  const handleToggleOnline = () => {
    syncService.toggleOnlineMode();
    const currentState = syncService.getState();
    showNotification(currentState.isOnline ? '🌐 Đã bật kết nối Đám mây Online' : '📴 Đã chuyển sang chế độ Làm việc Offline');
  };

  const handleResolveConflict = (id: string, resolution: 'local' | 'remote' | 'merge') => {
    syncService.resolveConflict(id, resolution);
    showNotification(`✅ Đã giải quyết xung đột bằng phương án: ${resolution === 'local' ? 'Bản cục bộ' : resolution === 'remote' ? 'Bản từ xa' : 'Gộp thông minh'}`);
  };

  const handleRemoveDevice = (id: string) => {
    syncService.removeDevice(id);
    showNotification('Đã gỡ thiết bị khỏi danh sách đồng bộ');
  };

  const handleCreateBackupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBackupName.trim()) return;
    syncService.createBackup(newBackupName, newBackupNote, null, 'manual');
    setNewBackupName('');
    setNewBackupNote('');
    setShowBackupModal(false);
    showNotification('🎉 Đã tạo bản sao lưu đám mây mới thành công!');
  };

  const handleRestoreBackup = (backupId: string) => {
    const restored = syncService.restoreBackup(backupId);
    if (restored) {
      showNotification(`🔄 Đã khôi phục thành công bản sao lưu "${restored.name}"!`);
    }
  };

  const handleDeleteBackup = (backupId: string) => {
    syncService.deleteBackup(backupId);
    showNotification('Đã xóa bản sao lưu');
  };

  const handleCreateVersionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersionName.trim()) return;
    versionManager.saveVersion('active-project', { mockProjectState: true }, {
      name: newVersionName,
      tag: newVersionTag,
      description: newVersionDesc,
      author: 'Người dùng chính',
      forceSnapshot: true
    });
    setNewVersionName('');
    setNewVersionDesc('');
    setShowVersionModal(false);
    showNotification('✨ Đã tạo điểm lưu phiên bản v1.1 mới!');
  };

  const handleRollbackVersion = (ver: ProjectVersion) => {
    versionManager.saveVersion('active-project', { mockProjectState: true }, {
      name: `Khôi phục từ ${ver.name}`,
      tag: 'System',
      description: `Rollback điểm khôi phục ${ver.id}`,
      author: 'Hệ thống'
    });
    showNotification(`⏪ Đã khôi phục dự án về điểm phiên bản "${ver.name}"!`);
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-2">
              <Cloud size={16} />
              <span>Unified Cloud Platform v1.1</span>
            </div>
            <Typography variant="h2" className="text-slate-900 tracking-tighter">
              Đồng bộ & Lưu trữ Đám mây
            </Typography>
            <Typography variant="body" className="text-slate-500 mt-2 max-w-xl">
              Tự động lưu trữ đám mây, quản lý điểm khôi phục phiên bản v1.1 và đồng bộ đa thiết bị an toàn.
            </Typography>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {/* Status Icon */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isSyncing ? 'bg-blue-100 text-blue-600' : 
              !syncState.isOnline ? 'bg-amber-100 text-amber-600' :
              syncState.status === 'synced' ? 'bg-emerald-100 text-emerald-600' : 
              'bg-slate-200 text-slate-500'
            }`}>
              {isSyncing ? <RefreshCw size={24} className="animate-spin" /> : 
               !syncState.isOnline ? <CloudOff size={24} /> :
               syncState.status === 'synced' ? <Cloud size={24} /> : 
               <CloudOff size={24} />}
            </div>

            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>{isSyncing ? 'Đang đồng bộ...' : !syncState.isOnline ? 'Chế độ Offline' : syncState.status === 'synced' ? 'Đã đồng bộ Đám mây' : 'Chưa đồng bộ'}</span>
                {syncState.pendingChanges > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-extrabold">
                    {syncState.pendingChanges} thay đổi chờ
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                Lần cuối: {new Date(syncState.lastSyncedAt).toLocaleTimeString()}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={handleToggleOnline}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  syncState.isOnline 
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                }`}
                title="Bật/Tắt kết nối mạng mô phỏng"
              >
                {syncState.isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
                <span>{syncState.isOnline ? 'Online' : 'Offline'}</span>
              </button>

              <Button 
                variant="outlined" 
                onClick={handleManualSync}
                disabled={isSyncing || !syncState.isOnline}
                className="bg-white"
              >
                Sync Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Tổng quan" icon={<Activity size={16} />} />
        <TabButton active={activeTab === 'versions'} onClick={() => setActiveTab('versions')} label={`Lịch sử Phiên bản (${versions.length})`} icon={<History size={16} />} />
        <TabButton active={activeTab === 'backups'} onClick={() => setActiveTab('backups')} label={`Sao lưu (${backups.length})`} icon={<Database size={16} />} />
        <TabButton active={activeTab === 'devices'} onClick={() => setActiveTab('devices')} label={`Thiết bị (${devices.length})`} icon={<Laptop size={16} />} />
        <TabButton 
          active={activeTab === 'conflicts'} 
          onClick={() => setActiveTab('conflicts')} 
          label={`Xung đột (${conflicts.length})`} 
          icon={<AlertTriangle size={16} />}
          badge={conflicts.length > 0} 
        />
      </div>

      {/* Content Panels */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4 text-blue-600">
                    <Zap size={24} />
                    <Typography variant="title">Smart Sync Engine v1.1</Typography>
                  </div>
                  <Typography variant="body-sm" className="text-blue-900/80 mb-4 flex-1">
                    Đồng bộ thông minh dạng Delta Diff, lưu dữ liệu thiệp, bản nhạc nền và dòng thời gian trực tiếp lên cloud.
                  </Typography>
                  <div className="bg-white/60 p-3 rounded-xl border border-blue-200/50 flex items-center justify-between text-xs font-bold text-blue-800">
                    <span>Tự động lưu Đám mây</span>
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full">Bật</span>
                  </div>
                </div>

                <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4 text-purple-600">
                    <History size={24} />
                    <Typography variant="title">Lịch sử Phiên bản Đám mây</Typography>
                  </div>
                  <Typography variant="body-sm" className="text-purple-900/80 mb-4 flex-1">
                    Hỗ trợ tạo các checkpoint điểm khôi phục an toàn trước khi xuất video thiệp hoặc thay đổi lớn.
                  </Typography>
                  <div className="bg-white/60 p-3 rounded-xl border border-purple-200/50 flex items-center justify-between text-xs font-bold text-purple-800">
                    <span>Tổng phiên bản lưu</span>
                    <span className="bg-purple-600 text-white px-2 py-0.5 rounded-full">{versions.length} Điểm</span>
                  </div>
                </div>

                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4 text-emerald-600">
                    <Lock size={24} />
                    <Typography variant="title">Offline-First Resilient</Typography>
                  </div>
                  <Typography variant="body-sm" className="text-emerald-900/80 mb-4 flex-1">
                    Cho phép làm việc mượt mà dù không có mạng. Thay đổi được đưa vào queue và tự động gộp khi reconnect.
                  </Typography>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                    <CheckCircle2 size={16} /> Cache an toàn cục bộ IndexedDB
                  </div>
                </div>
              </div>

              <div>
                <Typography variant="title" className="text-slate-900 mb-4">Cài đặt đồng bộ hạ tầng</Typography>
                <div className="space-y-3 max-w-2xl">
                  <SettingToggle label="Tự động lưu đám mây khi chỉnh sửa" desc="Lưu ngay thay đổi nội dung thiệp & âm nhạc" enabled={true} />
                  <SettingToggle label="Tự động tạo bản sao lưu trước khi xuất video" desc="Giúp dễ dàng khôi phục nếu muốn xuất lại" enabled={true} />
                  <SettingToggle label="Đồng bộ qua 4G/5G" desc="Sử dụng dữ liệu di động để đồng bộ" enabled={false} />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: VERSION HISTORY v1.1 */}
          {activeTab === 'versions' && (
            <motion.div key="versions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <Typography variant="h3" className="text-slate-900">Lịch sử Phiên bản v1.1</Typography>
                  <Typography variant="body-sm" className="text-slate-500">Quản lý các mốc điểm khôi phục dự án và rollback nhanh chóng.</Typography>
                </div>
                <Button 
                  variant="primary" 
                  onClick={() => setShowVersionModal(true)} 
                  className="bg-purple-600 hover:bg-purple-700 flex items-center gap-1.5"
                >
                  <Plus size={16} />
                  <span>Tạo mốc phiên bản mới</span>
                </Button>
              </div>

              <div className="space-y-4">
                {versions.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-sm">Chưa có mốc phiên bản nào được ghi lại.</div>
                ) : (
                  versions.map((ver, idx) => (
                    <div key={ver.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-purple-200 transition-all">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          ver.tag === 'Milestone' ? 'bg-amber-100 text-amber-700' :
                          ver.tag === 'Pre-Export' ? 'bg-rose-100 text-rose-700' :
                          ver.tag === 'Auto-Save' ? 'bg-blue-100 text-blue-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          <History size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-base">{ver.name}</span>
                            {ver.tag && (
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide ${
                                ver.tag === 'Milestone' ? 'bg-amber-100 text-amber-800' :
                                ver.tag === 'Pre-Export' ? 'bg-rose-100 text-rose-800' :
                                ver.tag === 'Auto-Save' ? 'bg-blue-100 text-blue-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {ver.tag}
                              </span>
                            )}
                            {idx === 0 && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold">Phiên bản hiện tại</span>
                            )}
                          </div>
                          {ver.description && (
                            <p className="text-xs text-slate-600 mt-1">{ver.description}</p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                            <span className="flex items-center gap-1"><Clock size={12} /> {new Date(ver.createdAt).toLocaleString()}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><User size={12} /> {ver.author || 'Người dùng'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        <Button
                          variant="outlined"
                          size="sm"
                          onClick={() => handleRollbackVersion(ver)}
                          className="text-purple-700 border-purple-200 hover:bg-purple-50 flex items-center gap-1"
                        >
                          <RotateCcw size={14} />
                          <span>Khôi phục điểm này</span>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 3: BACKUP SNAPSHOTS */}
          {activeTab === 'backups' && (
            <motion.div key="backups" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <Typography variant="h3" className="text-slate-900">Cloud Snapshot Center</Typography>
                  <Typography variant="body-sm" className="text-slate-500">Bản sao lưu khoảnh khắc kỉ niệm trên máy chủ Đám mây.</Typography>
                </div>
                <Button 
                  variant="primary" 
                  onClick={() => setShowBackupModal(true)} 
                  className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1.5"
                >
                  <Plus size={16} />
                  <span>Tạo bản sao lưu mới</span>
                </Button>
              </div>
              
              <div className="space-y-4">
                {backups.map(backup => (
                  <div key={backup.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:shadow-md transition-all gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${backup.type === 'auto' ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-600'}`}>
                        <Database size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{backup.name}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md uppercase font-extrabold">{backup.type}</span>
                        </div>
                        {backup.note && (
                          <p className="text-xs text-slate-500 mt-0.5">{backup.note}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-medium">
                          <span>{new Date(backup.timestamp).toLocaleString()}</span>
                          <span>•</span>
                          <span>{(backup.size / 1024 / 1024).toFixed(1)} MB</span>
                          <span>•</span>
                          <span>{backup.device}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteBackup(backup.id)} 
                        className="text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                        title="Xóa bản sao lưu"
                      >
                        <Trash2 size={16} />
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="sm" 
                        onClick={() => handleRestoreBackup(backup.id)}
                        className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 font-bold"
                      >
                        Khôi phục
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 4: DEVICES */}
          {activeTab === 'devices' && (
            <motion.div key="devices" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <Typography variant="h3" className="text-slate-900">Thiết bị đồng bộ</Typography>
                <span className="text-sm font-bold text-slate-500">{devices.length} thiết bị</span>
              </div>
              <div className="space-y-4">
                {devices.map(device => (
                  <div key={device.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${device.isCurrentDevice ? 'bg-indigo-100 text-indigo-600' : 'bg-white shadow-sm text-slate-500'}`}>
                        {device.type === 'windows' ? <Laptop size={24} /> : 
                         device.type === 'android' ? <Smartphone size={24} /> : 
                         <Tablet size={24} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-lg">{device.name}</span>
                          {device.isCurrentDevice && (
                            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest">Thiết bị này</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                          <span className="capitalize">{device.type}</span>
                          <span>•</span>
                          {device.status === 'online' ? (
                            <span className="text-emerald-500 font-bold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> Online</span>
                          ) : (
                            <span>Hoạt động {new Date(device.lastActive).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {!device.isCurrentDevice && (
                      <Button variant="outlined" size="sm" onClick={() => handleRemoveDevice(device.id)} className="text-rose-600 hover:bg-rose-50 hover:border-rose-200">
                        Đăng xuất
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 5: CONFLICT RESOLVER */}
          {activeTab === 'conflicts' && (
            <motion.div key="conflicts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <Typography variant="h3" className="text-slate-900 mb-2">Conflict Resolver</Typography>
              
              {conflicts.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <Typography variant="title" className="text-slate-900 mb-2">Mọi thứ đã nhất quán</Typography>
                  <Typography variant="body-sm" className="text-slate-500">Không có xung đột dữ liệu nào giữa các thiết bị.</Typography>
                </div>
              ) : (
                <div className="space-y-6">
                  {conflicts.map(conflict => (
                    <div key={conflict.id} className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                      <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={18} className="text-amber-500" />
                          <span className="font-bold text-slate-900">Xung đột chỉnh sửa</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(conflict.timestamp).toLocaleString()}</span>
                      </div>
                      
                      <div className="p-4 space-y-4">
                        <Typography variant="body-sm" className="text-slate-600">
                          Nội dung thiệp đã được chỉnh sửa độc lập ở hai nơi. Vui lòng chọn phiên bản giữ lại hoặc chọn Gộp thông minh.
                        </Typography>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-slate-200">
                            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Phiên bản cục bộ</span>
                            </div>
                            <div className="text-sm font-medium text-slate-800">
                              {conflict.localVersion.text}
                            </div>
                            <Button variant="outlined" size="sm" onClick={() => handleResolveConflict(conflict.id, 'local')} className="w-full mt-4 bg-slate-50">
                              Giữ bản này
                            </Button>
                          </div>
                          
                          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                            <div className="flex items-center justify-between mb-3 border-b border-amber-200/50 pb-2">
                              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Từ {conflict.remoteDeviceName}</span>
                            </div>
                            <div className="text-sm font-medium text-slate-800">
                              {conflict.remoteVersion.text}
                            </div>
                            <Button variant="outlined" size="sm" onClick={() => handleResolveConflict(conflict.id, 'remote')} className="w-full mt-4 bg-white text-amber-700 border-amber-200 hover:bg-amber-100">
                              Giữ bản này
                            </Button>
                          </div>
                        </div>

                        <div className="pt-2 flex justify-center">
                          <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={() => handleResolveConflict(conflict.id, 'merge')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
                          >
                            <Sparkles size={14} />
                            <span>Gộp cả 2 nội dung thông minh (Smart Merge)</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* CREATE BACKUP MODAL */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              Tạo bản sao lưu Đám mây mới
            </h3>
            <form onSubmit={handleCreateBackupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên bản sao lưu:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lữ hành kỉ niệm 2 năm - Bản chuẩn"
                  value={newBackupName}
                  onChange={e => setNewBackupName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú thêm (không bắt buộc):</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả nội dung bản sao lưu này..."
                  value={newBackupNote}
                  onChange={e => setNewBackupNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setShowBackupModal(false)}>Hủy</Button>
                <Button type="submit" variant="primary" className="bg-indigo-600 hover:bg-indigo-700">Tạo Sao lưu</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE VERSION MODAL */}
      {showVersionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-purple-600" />
              Tạo mốc phiên bản mới (v1.1)
            </h3>
            <form onSubmit={handleCreateVersionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên phiên bản:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Phiên bản hoàn thiện âm nhạc & lời chúc"
                  value={newVersionName}
                  onChange={e => setNewVersionName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Thẻ phân loại Tag:</label>
                <select
                  value={newVersionTag}
                  onChange={e => setNewVersionTag(e.target.value as VersionTag)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Milestone">🌟 Milestone (Mốc quan trọng)</option>
                  <option value="Pre-Export">🎬 Pre-Export (Trước khi xuất video)</option>
                  <option value="Manual">✍️ Manual (Lưu thủ công)</option>
                  <option value="Auto-Save">🔄 Auto-Save (Tự động)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả thay đổi:</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả các chỉnh sửa ở mốc này..."
                  value={newVersionDesc}
                  onChange={e => setNewVersionDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setShowVersionModal(false)}>Hủy</Button>
                <Button type="submit" variant="primary" className="bg-purple-600 hover:bg-purple-700">Tạo Phiên bản</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, label: string, icon?: React.ReactNode, badge?: boolean }> = ({ active, onClick, label, icon, badge }) => (
  <button
    onClick={onClick}
    className={`px-6 py-4 flex items-center gap-2 text-sm font-bold border-b-2 transition-colors shrink-0 relative cursor-pointer ${
      active ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
    }`}
  >
    {icon}
    {label}
    {badge && <div className="absolute top-3 right-2 w-2 h-2 rounded-full bg-rose-500" />}
  </button>
);

const SettingToggle: React.FC<{ label: string, desc: string, enabled: boolean }> = ({ label, desc, enabled }) => (
  <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-100">
    <div>
      <div className="text-sm font-bold text-slate-900">{label}</div>
      <div className="text-[11px] text-slate-500 font-medium">{desc}</div>
    </div>
    <div className={`w-10 h-5 rounded-full transition-colors relative ${enabled ? 'bg-indigo-500' : 'bg-slate-200'}`}>
      <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-sm border border-slate-100 transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  </div>
);

// Fallback Activity icon
const Activity: React.FC<any> = (props) => <RefreshCw {...props} />;

export default SyncDashboard;

