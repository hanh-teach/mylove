import React from 'react';
import { 
  LayoutDashboard, 
  PenTool, 
  ImageIcon, 
  Clock, 
  Wand2, 
  Download, 
  Settings,
  ChevronLeft,
  Command
} from 'lucide-react';
import { AppTabType } from '../../types';

interface ProjectSidebarProps {
  activeTab: AppTabType;
  onTabChange: (tab: AppTabType) => void;
  onBackToWorkspace: () => void;
  projectTitle: string;
  projectIcon: string;
}

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  activeTab,
  onTabChange,
  onBackToWorkspace,
  projectTitle,
  projectIcon
}) => {
  const menuItems = [
    { id: 'project-dashboard', label: 'Tổng quan', icon: <LayoutDashboard size={18} /> },
    { id: 'editor', label: 'Nội dung', icon: <PenTool size={18} /> },
    { id: 'assets', label: 'Media & Tài sản', icon: <ImageIcon size={18} /> },
    { id: 'timeline', label: 'Dòng thời gian', icon: <Clock size={18} /> },
    { id: 'aistudio', label: 'AI Assistant', icon: <Wand2 size={18} /> },
    { id: 'card', label: 'Xuất bản', icon: <Download size={18} /> },
    { id: 'settings', label: 'Cài đặt', icon: <Settings size={18} /> },
  ];

  return (
    <div className="w-64 h-full bg-white border-r border-slate-100 flex flex-col">
      {/* Project Header */}
      <div className="p-6 border-b border-slate-50">
        <button 
          onClick={onBackToWorkspace}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-[10px] font-black uppercase tracking-widest mb-4 transition-colors"
        >
          <ChevronLeft size={12} />
          Workspace
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-xl shadow-sm border border-slate-100">
            {projectIcon}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Dự án</div>
            <div className="text-sm font-black text-slate-900 truncate tracking-tight">{projectTitle}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as AppTabType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                isActive 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-slate-400'}>
                {item.icon}
              </span>
              <span className="text-sm font-bold tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom info */}
      <div className="p-6 border-t border-slate-50 space-y-4">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2">
            <Command size={12} className="text-slate-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lệnh nhanh</span>
          </div>
          <span className="text-[10px] font-black bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-500">⌘K</span>
        </div>
        
        <div className="bg-slate-50 rounded-2xl p-4">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Trạng thái</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-700">Đang hoạt động</span>
          </div>
        </div>
      </div>
    </div>
  );
};
