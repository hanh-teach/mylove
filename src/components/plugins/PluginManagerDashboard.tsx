import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Puzzle, PackageSearch, ShieldCheck, Download, Trash2, 
  Settings2, Activity, Play, Square, ExternalLink, Code2,
  CheckCircle2, AlertTriangle, Blocks, Sparkles, Terminal
} from 'lucide-react';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { pluginService } from '../../modules/plugins/PluginService';
import { PluginInstance, PluginManifest, PluginPermission } from '../../modules/plugins/types';

export const PluginManagerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'installed' | 'discover' | 'permissions' | 'developer'>('installed');
  const [installed, setInstalled] = useState<PluginInstance[]>(pluginService.getInstalledPlugins());
  const [available, setAvailable] = useState<PluginManifest[]>(pluginService.getAvailablePlugins());
  const [devModeEnabled, setDevModeEnabled] = useState(false);

  const handleToggleState = (id: string, activate: boolean) => {
    pluginService.togglePlugin(id, activate);
    setInstalled([...pluginService.getInstalledPlugins()]);
  };

  const handleUninstall = (id: string) => {
    pluginService.uninstallPlugin(id);
    setInstalled([...pluginService.getInstalledPlugins()]);
    // Also re-fetch available so they reappear there (in real world might need to re-fetch from network)
    // For this mock, we'll just let it be.
  };

  const handleInstall = (manifest: PluginManifest) => {
    pluginService.installPlugin(manifest, manifest.permissions);
    setInstalled([...pluginService.getInstalledPlugins()]);
    setAvailable([...pluginService.getAvailablePlugins()]);
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">
              <Blocks size={16} />
              <span>Plugin Platform</span>
            </div>
            <Typography variant="h2" className="text-slate-900 tracking-tighter">
              Tiện ích mở rộng
            </Typography>
            <Typography variant="body" className="text-slate-500 mt-2 max-w-xl">
              Mở rộng khả năng của hệ thống với các plugin, hoạt động an toàn trong môi trường sandbox độc lập.
            </Typography>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-600">
              <Puzzle size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                {installed.length} Plugins
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Đã cài đặt
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('discover')}
              className="ml-4"
            >
              Khám phá thêm
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 items-center justify-between">
        <div className="flex">
          <TabButton active={activeTab === 'installed'} onClick={() => setActiveTab('installed')} label="Đã cài đặt" icon={<Puzzle size={16} />} />
          <TabButton active={activeTab === 'discover'} onClick={() => setActiveTab('discover')} label="Khám phá" icon={<PackageSearch size={16} />} />
          <TabButton active={activeTab === 'permissions'} onClick={() => setActiveTab('permissions')} label="Quyền truy cập" icon={<ShieldCheck size={16} />} />
          {devModeEnabled && (
            <TabButton active={activeTab === 'developer'} onClick={() => setActiveTab('developer')} label="Developer" icon={<Code2 size={16} />} />
          )}
        </div>
        
        {/* Developer Mode Toggle */}
        <div className="flex items-center gap-2 px-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dev Mode</span>
          <button 
            onClick={() => {
              setDevModeEnabled(!devModeEnabled);
              if (activeTab === 'developer' && devModeEnabled) setActiveTab('installed');
            }}
            className={`w-10 h-5 rounded-full transition-colors relative ${devModeEnabled ? 'bg-indigo-500' : 'bg-slate-200'}`}
          >
            <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${devModeEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'installed' && (
            <motion.div key="installed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <Typography variant="h3" className="text-slate-900 mb-6">Plugins của bạn</Typography>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {installed.map(plugin => (
                  <div key={plugin.manifest.id} className={`flex flex-col p-5 rounded-2xl border transition-colors ${plugin.status === 'active' ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-80'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          plugin.manifest.category === 'ai' ? 'bg-purple-100 text-purple-600' :
                          plugin.manifest.category === 'theme' ? 'bg-amber-100 text-amber-600' :
                          plugin.manifest.category === 'integration' ? 'bg-blue-100 text-blue-600' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {plugin.manifest.category === 'ai' ? <Sparkles size={24} /> :
                           plugin.manifest.category === 'theme' ? <Activity size={24} /> :
                           <Puzzle size={24} />}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-base">{plugin.manifest.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 font-medium">
                            <span>v{plugin.manifest.version}</span>
                            <span>•</span>
                            <span>{plugin.manifest.author}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {plugin.status === 'active' ? (
                          <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Inactive
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <Typography variant="body-sm" className="text-slate-600 mb-4 flex-1">
                      {plugin.manifest.description}
                    </Typography>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                        <CheckCircle2 size={12} />
                        <span>Chữ ký hợp lệ</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleUninstall(plugin.manifest.id)}
                          className="text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                        >
                          Gỡ cài đặt
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleState(plugin.manifest.id, plugin.status !== 'active')}
                          className={plugin.status === 'active' ? 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-200'}
                        >
                          {plugin.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {installed.length === 0 && (
                  <div className="col-span-2 py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-2xl">
                    <Puzzle size={32} className="text-slate-300 mb-4" />
                    <Typography variant="h4" className="text-slate-900 mb-2">Chưa có Plugin nào</Typography>
                    <Typography variant="body-sm" className="text-slate-500 mb-4">Mở rộng khả năng của ứng dụng bằng cách cài đặt plugin.</Typography>
                    <Button variant="primary" onClick={() => setActiveTab('discover')}>Khám phá Plugins</Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'discover' && (
            <motion.div key="discover" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <Typography variant="h3" className="text-slate-900">Marketplace Preview</Typography>
                  <Typography variant="body-sm" className="text-slate-500">Tìm kiếm các plugin để nâng cấp trải nghiệm của bạn.</Typography>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {available.map(plugin => (
                  <div key={plugin.id} className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                        plugin.category === 'ai' ? 'bg-purple-100 text-purple-600' :
                        plugin.category === 'export' ? 'bg-emerald-100 text-emerald-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {plugin.category === 'ai' ? <Sparkles size={20} /> :
                         plugin.category === 'export' ? <Download size={20} /> :
                         <Puzzle size={20} />}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                        {plugin.category}
                      </span>
                    </div>
                    
                    <h4 className="font-bold text-slate-900 text-base">{plugin.name}</h4>
                    <Typography variant="body-sm" className="text-slate-500 mb-4 mt-1 flex-1">
                      {plugin.description}
                    </Typography>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                      <div className="text-[11px] text-slate-500 font-medium">By {plugin.author}</div>
                      <Button variant="primary" size="sm" onClick={() => handleInstall(plugin)}>Cài đặt</Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'permissions' && (
            <motion.div key="permissions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <Typography variant="h3" className="text-slate-900 mb-2">Quản lý quyền truy cập</Typography>
              <Typography variant="body-sm" className="text-slate-500 mb-6 max-w-2xl">
                Các plugin chạy trong Sandbox cách ly. Bạn có thể kiểm soát dữ liệu nào được phép truy cập bởi từng plugin.
              </Typography>
              
              <div className="space-y-4">
                {installed.map(plugin => (
                  <div key={plugin.manifest.id} className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="font-bold text-slate-900">{plugin.manifest.name}</div>
                        {plugin.manifest.permissions.length === 0 && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Không yêu cầu quyền</span>
                        )}
                      </div>
                    </div>
                    
                    {plugin.manifest.permissions.length > 0 && (
                      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {plugin.manifest.permissions.map(perm => (
                          <div key={perm} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2">
                              {perm.includes('internet') ? <ExternalLink size={14} className="text-indigo-500" /> :
                               <ShieldCheck size={14} className="text-slate-400" />}
                              <span className="text-sm font-medium text-slate-700">{perm}</span>
                            </div>
                            <div className="w-8 h-4 rounded-full bg-emerald-500 relative cursor-pointer">
                              <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'developer' && devModeEnabled && (
            <motion.div key="developer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h3" className="text-slate-900">Developer Console</Typography>
                <Button variant="outline" size="sm" className="gap-2">
                  <Terminal size={14} /> Tải Plugin nội bộ
                </Button>
              </div>
              
              <div className="bg-slate-900 rounded-2xl p-4 overflow-hidden border border-slate-800">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-mono text-slate-500">plugin-runtime-logs</span>
                </div>
                
                <div className="font-mono text-xs text-slate-300 space-y-2 h-[250px] overflow-y-auto">
                  <div className="text-emerald-400">[info] Sandbox initialized successfully.</div>
                  <div className="text-blue-400">[info] Loading ext.ai.grammar v2.0.1...</div>
                  <div>[debug] Injecting editor hooks for ext.ai.grammar...</div>
                  <div className="text-blue-400">[info] Loading ln.theme.twilight v1.2.0...</div>
                  <div>[debug] Applying CSS variables for ln.theme.twilight...</div>
                  <div className="text-emerald-400">[info] All active plugins loaded.</div>
                  <div className="text-slate-500">_</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, label: string, icon?: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`px-6 py-4 flex items-center gap-2 text-sm font-bold border-b-2 transition-colors ${
      active ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
    }`}
  >
    {icon}
    {label}
  </button>
);
