import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cloud, CloudOff, Laptop, Smartphone, Tablet, 
  History, AlertTriangle, ShieldCheck, Database, FileText, 
  Settings, CheckCircle2, ChevronRight, Download, Trash2, 
  RefreshCw, SmartphoneNfc, Zap, Lock
} from 'lucide-react';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { syncService } from '../../modules/sync/SyncService';
import { SyncState, Device, BackupSnapshot, SyncConflict } from '../../modules/sync/types';

export const SyncDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'devices' | 'backups' | 'conflicts'>('overview');
  const [syncState, setSyncState] = useState<SyncState>(syncService.getState());
  const [devices, setDevices] = useState<Device[]>(syncService.getDevices());
  const [backups, setBackups] = useState<BackupSnapshot[]>(syncService.getBackups());
  const [conflicts, setConflicts] = useState<SyncConflict[]>(syncService.getConflicts());
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = () => {
    setIsSyncing(true);
    syncService.simulateSync();
    setTimeout(() => {
      setSyncState(syncService.getState());
      setIsSyncing(false);
    }, 1500);
  };

  const handleResolveConflict = (id: string, resolution: 'local' | 'remote') => {
    syncService.resolveConflict(id, resolution);
    setConflicts(syncService.getConflicts());
  };

  const handleRemoveDevice = (id: string) => {
    syncService.removeDevice(id);
    setDevices(syncService.getDevices());
  };

  const handleCreateBackup = () => {
    syncService.createBackup('Manual Backup - ' + new Date().toLocaleDateString());
    setBackups(syncService.getBackups());
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-2">
              <Cloud size={16} />
              <span>Unified Cloud Platform</span>
            </div>
            <Typography variant="h2" className="text-slate-900 tracking-tighter">
              Đồng bộ & Lưu trữ
            </Typography>
            <Typography variant="body" className="text-slate-500 mt-2 max-w-xl">
              Quản lý đồng bộ đa thiết bị, giải quyết xung đột và sao lưu dữ liệu an toàn.
            </Typography>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isSyncing ? 'bg-blue-100 text-blue-600' : 
              syncState.status === 'synced' ? 'bg-emerald-100 text-emerald-600' : 
              'bg-slate-200 text-slate-500'
            }`}>
              {isSyncing ? <RefreshCw size={24} className="animate-spin" /> : 
               syncState.status === 'synced' ? <Cloud size={24} /> : 
               <CloudOff size={24} />}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                {isSyncing ? 'Đang đồng bộ...' : syncState.status === 'synced' ? 'Đã đồng bộ' : 'Chưa đồng bộ'}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Cập nhật: {new Date(syncState.lastSyncedAt).toLocaleTimeString()}
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleManualSync}
              disabled={isSyncing}
              className="ml-4"
            >
              Sync Now
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Tổng quan" icon={<Activity size={16} />} />
        <TabButton active={activeTab === 'devices'} onClick={() => setActiveTab('devices')} label="Thiết bị" icon={<Laptop size={16} />} />
        <TabButton active={activeTab === 'backups'} onClick={() => setActiveTab('backups')} label="Sao lưu" icon={<Database size={16} />} />
        <TabButton 
          active={activeTab === 'conflicts'} 
          onClick={() => setActiveTab('conflicts')} 
          label={`Xung đột (${conflicts.length})`} 
          icon={<AlertTriangle size={16} />}
          badge={conflicts.length > 0} 
        />
      </div>

      {/* Content */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4 text-blue-600">
                    <Zap size={24} />
                    <Typography variant="h4">Smart Sync Engine</Typography>
                  </div>
                  <Typography variant="body-sm" className="text-blue-900/80 mb-4 flex-1">
                    Đồng bộ thông minh chỉ truyền phần thay đổi (delta sync) giúp tiết kiệm băng thông và tối ưu hiệu suất.
                  </Typography>
                  <div className="bg-white/60 p-3 rounded-xl border border-blue-200/50 flex items-center justify-between text-xs font-bold text-blue-800">
                    <span>Background Sync</span>
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full">ON</span>
                  </div>
                </div>

                <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4 text-purple-600">
                    <SmartphoneNfc size={24} />
                    <Typography variant="h4">Continue Anywhere</Typography>
                  </div>
                  <Typography variant="body-sm" className="text-purple-900/80 mb-4 flex-1">
                    Lưu trữ trạng thái làm việc (vị trí con trỏ, mức zoom) để bạn có thể tiếp tục công việc trên thiết bị khác ngay lập tức.
                  </Typography>
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-purple-50 bg-white flex items-center justify-center text-slate-400 z-30"><Laptop size={14}/></div>
                    <div className="w-8 h-8 rounded-full border-2 border-purple-50 bg-white flex items-center justify-center text-slate-400 z-20"><Smartphone size={14}/></div>
                    <div className="w-8 h-8 rounded-full border-2 border-purple-50 bg-white flex items-center justify-center text-slate-400 z-10"><Tablet size={14}/></div>
                  </div>
                </div>

                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4 text-emerald-600">
                    <Lock size={24} />
                    <Typography variant="h4">Offline First</Typography>
                  </div>
                  <Typography variant="body-sm" className="text-emerald-900/80 mb-4 flex-1">
                    Ứng dụng vẫn hoạt động bình thường khi mất kết nối. Mọi thay đổi sẽ được đưa vào hàng đợi và đồng bộ khi có mạng.
                  </Typography>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                    <CheckCircle2 size={16} /> Cache an toàn cục bộ
                  </div>
                </div>
              </div>

              <div>
                <Typography variant="h4" className="text-slate-900 mb-4">Cài đặt đồng bộ</Typography>
                <div className="space-y-3 max-w-2xl">
                  <SettingToggle label="Đồng bộ tự động" desc="Đồng bộ ngay khi có thay đổi" enabled={true} />
                  <SettingToggle label="Đồng bộ qua 4G/5G" desc="Sử dụng dữ liệu di động để đồng bộ" enabled={false} />
                  <SettingToggle label="Asset Streaming" desc="Chỉ tải hình ảnh/video khi cần hiển thị" enabled={true} />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'devices' && (
            <motion.div key="devices" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <Typography variant="h3" className="text-slate-900">Thiết bị của bạn</Typography>
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
                      <Button variant="outline" size="sm" onClick={() => handleRemoveDevice(device.id)} className="text-rose-600 hover:bg-rose-50 hover:border-rose-200">
                        Đăng xuất
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'backups' && (
            <motion.div key="backups" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <Typography variant="h3" className="text-slate-900">Backup Center</Typography>
                  <Typography variant="body-sm" className="text-slate-500">Khôi phục trạng thái từ các bản sao lưu an toàn.</Typography>
                </div>
                <Button variant="primary" onClick={handleCreateBackup} className="bg-indigo-600 hover:bg-indigo-700">
                  Tạo bản sao lưu mới
                </Button>
              </div>
              
              <div className="space-y-4">
                {backups.map(backup => (
                  <div key={backup.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${backup.type === 'auto' ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-600'}`}>
                        <Database size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{backup.name}</div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-medium">
                          <span>{new Date(backup.timestamp).toLocaleString()}</span>
                          <span>•</span>
                          <span>{(backup.size / 1024 / 1024).toFixed(1)} MB</span>
                          <span>•</span>
                          <span>{backup.device}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-slate-500"><Download size={16} /></Button>
                      <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">Khôi phục</Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'conflicts' && (
            <motion.div key="conflicts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <Typography variant="h3" className="text-slate-900 mb-2">Conflict Resolver</Typography>
              
              {conflicts.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <Typography variant="h4" className="text-slate-900 mb-2">Mọi thứ đã đồng bộ</Typography>
                  <Typography variant="body-sm" className="text-slate-500">Không có xung đột dữ liệu nào cần giải quyết.</Typography>
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
                      
                      <div className="p-4">
                        <Typography variant="body-sm" className="text-slate-600 mb-4">
                          Bạn và một thiết bị khác đã sửa đổi cùng một nội dung. Vui lòng chọn phiên bản để giữ lại.
                        </Typography>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-slate-200">
                            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Phiên bản cục bộ (Thiết bị này)</span>
                            </div>
                            <div className="text-sm font-medium text-slate-800">
                              {conflict.localVersion.text}
                            </div>
                            <Button variant="outline" size="sm" onClick={() => handleResolveConflict(conflict.id, 'local')} className="w-full mt-4 bg-slate-50">
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
                            <Button variant="outline" size="sm" onClick={() => handleResolveConflict(conflict.id, 'remote')} className="w-full mt-4 bg-white text-amber-700 border-amber-200 hover:bg-amber-100">
                              Giữ bản này
                            </Button>
                          </div>
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
    </div>
  );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, label: string, icon?: React.ReactNode, badge?: boolean }> = ({ active, onClick, label, icon, badge }) => (
  <button
    onClick={onClick}
    className={`px-6 py-4 flex items-center gap-2 text-sm font-bold border-b-2 transition-colors relative ${
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
