import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, Key, Webhook, History, Code2, ShieldAlert,
  Plus, Copy, Trash2, Power, Eye, ExternalLink, Activity, 
  Search, Lock, Globe, Server, FileJson, Puzzle
} from 'lucide-react';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { developerService } from '../../modules/developer/DeveloperService';

export const DeveloperDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'api-keys' | 'webhooks' | 'audit' | 'explorer' | 'docs'>('api-keys');
  
  const apiKeys = developerService.getApiKeys();
  const webhooks = developerService.getWebhooks();
  const auditLogs = developerService.getAuditLogs();
  const endpoints = developerService.getEndpoints();

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 opacity-60" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-2">
              <Terminal size={16} />
              <span>Platform Governance</span>
            </div>
            <Typography variant="h2" className="text-white tracking-tighter">
              Developer Portal
            </Typography>
            <Typography variant="body" className="text-slate-400 mt-2 max-w-xl">
              Quản lý truy cập API, Webhooks, và theo dõi nhật ký hệ thống (Audit Log).
            </Typography>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-md">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-800 text-emerald-400 border border-slate-700">
              <Server size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                API v1 Active
              </div>
              <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                Hệ thống ổn định
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 border-b border-slate-200 hide-scrollbar items-center justify-between">
        <div className="flex">
          <TabButton active={activeTab === 'api-keys'} onClick={() => setActiveTab('api-keys')} label="API Keys" icon={<Key size={16} />} />
          <TabButton active={activeTab === 'webhooks'} onClick={() => setActiveTab('webhooks')} label="Webhooks" icon={<Webhook size={16} />} />
          <TabButton active={activeTab === 'explorer'} onClick={() => setActiveTab('explorer')} label="API Explorer" icon={<Code2 size={16} />} />
          <TabButton active={activeTab === 'audit'} onClick={() => setActiveTab('audit')} label="Audit Log" icon={<History size={16} />} />
          <TabButton active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} label="Tài liệu (Docs)" icon={<FileJson size={16} />} />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'api-keys' && (
            <motion.div key="api-keys" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Typography variant="h3" className="text-slate-900">Quản lý API Keys</Typography>
                  <Typography variant="body-sm" className="text-slate-500">Tạo khóa truy cập cho ứng dụng hoặc nền tảng bên ngoài.</Typography>
                </div>
                <Button variant="primary" className="bg-slate-900 hover:bg-slate-800 text-white gap-2">
                  <Plus size={16} /> Tạo API Key mới
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                      <th className="pb-3 font-bold">Tên / Key</th>
                      <th className="pb-3 font-bold">Quyền (Scopes)</th>
                      <th className="pb-3 font-bold">Lần cuối sử dụng</th>
                      <th className="pb-3 font-bold">Trạng thái</th>
                      <th className="pb-3 font-bold text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {apiKeys.map(key => (
                      <tr key={key.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-4">
                          <div className="font-bold text-slate-900">{key.name}</div>
                          <div className="text-xs font-mono text-slate-500 flex items-center gap-2 mt-1">
                            {key.keyPrefix}
                            <button className="text-slate-400 hover:text-slate-700"><Copy size={12}/></button>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex flex-wrap gap-1">
                            {key.scopes.map(s => (
                              <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-mono border border-slate-200">{s}</span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 text-slate-500 text-xs">
                          {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString() : 'Chưa sử dụng'}
                        </td>
                        <td className="py-4">
                          {key.status === 'active' ? (
                            <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">Active</span>
                          ) : (
                            <span className="px-2 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-wider">Revoked</span>
                          )}
                        </td>
                        <td className="py-4 text-right">
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-rose-600 p-2">
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'webhooks' && (
            <motion.div key="webhooks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Typography variant="h3" className="text-slate-900">Webhooks</Typography>
                  <Typography variant="body-sm" className="text-slate-500">Đăng ký URL để nhận sự kiện từ hệ thống theo thời gian thực.</Typography>
                </div>
                <Button variant="primary" className="bg-slate-900 hover:bg-slate-800 text-white gap-2">
                  <Plus size={16} /> Thêm Webhook
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {webhooks.map(wh => (
                  <div key={wh.id} className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${wh.active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <h4 className="font-bold text-slate-900">{wh.name}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="p-1.5 text-slate-400"><Power size={14}/></Button>
                        <Button variant="ghost" size="sm" className="p-1.5 text-slate-400 hover:text-rose-500"><Trash2 size={14}/></Button>
                      </div>
                    </div>
                    
                    <div className="text-xs font-mono text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 mb-3 truncate">
                      {wh.url}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {wh.events.map(e => (
                        <span key={e} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-mono border border-blue-100">{e}</span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-100">
                      <span>Lần kích hoạt cuối: {wh.lastTriggeredAt ? new Date(wh.lastTriggeredAt).toLocaleString() : 'Chưa bao giờ'}</span>
                      <Button variant="ghost" size="sm" className="text-indigo-600 p-0 h-auto font-bold text-[11px]">Xem log</Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'explorer' && (
            <motion.div key="explorer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Typography variant="h3" className="text-slate-900">API Explorer</Typography>
                  <Typography variant="body-sm" className="text-slate-500">Khám phá và thử nghiệm các API mở của nền tảng.</Typography>
                </div>
                <div className="relative w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Tìm kiếm API..." className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Endpoint List */}
                <div className="w-full md:w-1/3 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  {endpoints.map(ep => (
                    <div key={ep.path + ep.method} className="border-b border-slate-100 p-3 hover:bg-slate-50 cursor-pointer transition-colors flex items-center gap-3">
                      <span className={`text-[10px] font-black uppercase w-12 text-center rounded py-0.5 ${
                        ep.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                        ep.method === 'POST' ? 'bg-emerald-100 text-emerald-700' :
                        ep.method === 'DELETE' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {ep.method}
                      </span>
                      <div className="flex-1 overflow-hidden">
                        <div className="text-sm font-mono text-slate-800 truncate">{ep.path}</div>
                        <div className="text-[10px] text-slate-500 truncate">{ep.summary}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* API Details Panel */}
                <div className="w-full md:w-2/3 border border-slate-200 rounded-2xl p-6 bg-slate-50 flex flex-col justify-center items-center text-center">
                  <Code2 size={48} className="text-slate-300 mb-4" />
                  <Typography variant="h4" className="text-slate-900 mb-2">Chọn một Endpoint</Typography>
                  <Typography variant="body-sm" className="text-slate-500 max-w-sm">
                    Chọn API từ danh sách bên trái để xem schema, tài liệu, và thực hiện request thử nghiệm.
                  </Typography>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'audit' && (
            <motion.div key="audit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Typography variant="h3" className="text-slate-900">Audit Log</Typography>
                  <Typography variant="body-sm" className="text-slate-500">Ghi nhận toàn bộ hành động bảo mật và truy cập vào hệ thống.</Typography>
                </div>
                <Button variant="outline" className="gap-2 bg-white">
                  <Search size={16} /> Lọc kết quả
                </Button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-bold text-slate-600 text-xs uppercase">Thời gian</th>
                      <th className="py-3 px-4 font-bold text-slate-600 text-xs uppercase">Người dùng / App</th>
                      <th className="py-3 px-4 font-bold text-slate-600 text-xs uppercase">Hành động</th>
                      <th className="py-3 px-4 font-bold text-slate-600 text-xs uppercase">IP Address</th>
                      <th className="py-3 px-4 font-bold text-slate-600 text-xs uppercase text-right">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map(log => (
                      <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{log.actorName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{log.actorId}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-500 font-mono">
                          {log.ipAddress}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-800 p-2">
                            <Eye size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'docs' && (
            <motion.div key="docs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex flex-col items-center justify-center text-center py-12 px-4 border border-slate-200 rounded-3xl bg-gradient-to-b from-white to-slate-50">
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6 shadow-sm border border-indigo-200">
                  <FileJson size={32} />
                </div>
                <Typography variant="h2" className="text-slate-900 mb-4">LoveNote Developer Documentation</Typography>
                <Typography variant="body" className="text-slate-500 max-w-2xl mb-8">
                  Nền tảng của chúng tôi cung cấp đầy đủ REST API, Webhooks, và SDKs cho các ngôn ngữ phổ biến, 
                  giúp bạn dễ dàng tích hợp và mở rộng hệ sinh thái.
                </Typography>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full">
                  <a href="#" className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-indigo-400 hover:shadow-md transition-all flex flex-col items-center gap-3 group">
                    <Globe size={24} className="text-slate-400 group-hover:text-indigo-500" />
                    <div className="font-bold text-slate-900">REST API Guide</div>
                  </a>
                  <a href="#" className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-indigo-400 hover:shadow-md transition-all flex flex-col items-center gap-3 group">
                    <Puzzle size={24} className="text-slate-400 group-hover:text-indigo-500" />
                    <div className="font-bold text-slate-900">Plugin SDK</div>
                  </a>
                  <a href="#" className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-indigo-400 hover:shadow-md transition-all flex flex-col items-center gap-3 group">
                    <ShieldAlert size={24} className="text-slate-400 group-hover:text-indigo-500" />
                    <div className="font-bold text-slate-900">Auth & Security</div>
                  </a>
                </div>
                
                <Button variant="primary" className="mt-8 bg-slate-900 hover:bg-slate-800 text-white px-8 gap-2">
                  Truy cập cổng tài liệu <ExternalLink size={16} />
                </Button>
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
    className={`px-5 py-3 flex items-center gap-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap shrink-0 ${
      active ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'
    }`}
  >
    {icon}
    {label}
  </button>
);
