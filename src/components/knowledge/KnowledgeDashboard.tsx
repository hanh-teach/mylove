import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, 
  Search, 
  Plus, 
  Network, 
  Clock, 
  MapPin, 
  Users, 
  Sparkles, 
  ChevronRight,
  Filter,
  Layers,
  Heart,
  ExternalLink,
  BrainCircuit,
  Settings,
  MoreVertical,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { IKnowledgeItem, KnowledgeType } from '../../modules/knowledge/KnowledgeTypes';
import { knowledgeService } from '../../modules/knowledge/KnowledgeService';
import { aiMemoryService } from '../../modules/ai/AIMemoryService';
import { KnowledgeTimeline } from './KnowledgeTimeline';

interface KnowledgeDashboardProps {
  projectId: string;
}

export const KnowledgeDashboard: React.FC<KnowledgeDashboardProps> = ({ projectId }) => {
  const [items, setItems] = useState<IKnowledgeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<KnowledgeType | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'graph'>('grid');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    knowledgeService.seedInitialData(projectId);
    setItems(knowledgeService.getKnowledgeItems(projectId));
  }, [projectId]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || item.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [items, searchQuery, selectedType]);

  const aiMemory = useMemo(() => aiMemoryService.getAIMemory(projectId), [projectId]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
              <Database size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Knowledge Workspace</h1>
              <p className="text-slate-500 font-medium">Trung tâm kết nối và ngữ cảnh thông minh cho Project của bạn.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Tìm kiếm Knowledge..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl w-full md:w-80 shadow-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all font-medium"
            />
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>
      </div>

      {/* Intelligence & Context Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <BrainCircuit size={120} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-white/10 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest">
                    AI Context Engine 2.0
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30 text-[9px] font-bold uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active
                  </div>
                </div>
                <button className="text-white/60 hover:text-white transition-colors">
                  <Settings size={20} />
                </button>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black tracking-tight">AI Working Memory</h2>
                <p className="text-slate-300 text-sm font-medium max-w-lg">
                  AI đang duy trì ngữ cảnh cho Project này. Các tùy chọn văn phong và dữ liệu liên kết được tối ưu hóa tự động.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <MemoryStat icon={<Activity size={14} />} label="Context Quality" value="98%" />
                <MemoryStat icon={<Layers size={14} />} label="Relationships" value={items.reduce((acc, curr) => acc + (curr.relationships?.length || 0), 0).toString()} />
                <MemoryStat icon={<Sparkles size={14} />} label="AI Notes" value={items.reduce((acc, curr) => acc + (curr.aiNotes?.length || 0), 0).toString()} />
                <MemoryStat icon={<Clock size={14} />} label="Last Sync" value="Vừa xong" />
              </div>
            </div>
          </div>
          
          <KnowledgeTimeline />
        </div>

        <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">AI Preferences</h3>
              <Sparkles size={14} className="text-amber-500" />
            </div>
            <div className="space-y-3">
              <PreferenceTag label="Văn phong" value={aiMemory.preferences.writingStyle || 'N/A'} />
              <PreferenceTag label="Tông giọng" value={aiMemory.preferences.tone || 'N/A'} />
              <PreferenceTag label="Kết thúc" value={aiMemory.preferences.endingStyle || 'N/A'} />
              <PreferenceTag label="Định dạng" value={aiMemory.preferences.outputFormat || 'N/A'} />
            </div>
          </div>
          <button className="w-full mt-6 py-3 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors">
            Cập nhật bộ nhớ
          </button>
        </div>
      </div>

      {/* Filter & View Mode Bar */}
      <div className="flex items-center justify-between bg-white/60 backdrop-blur-md p-2 rounded-2xl border border-slate-200 shadow-sm sticky top-4 z-30">
        <div className="flex items-center gap-1">
          <FilterTab active={selectedType === 'all'} label="Tất cả" onClick={() => setSelectedType('all')} />
          <FilterTab active={selectedType === 'person'} label="Nhân vật" onClick={() => setSelectedType('person')} />
          <FilterTab active={selectedType === 'place'} label="Địa điểm" onClick={() => setSelectedType('place')} />
          <FilterTab active={selectedType === 'event'} label="Sự kiện" onClick={() => setSelectedType('event')} />
          <FilterTab active={selectedType === 'object'} label="Vật thể" onClick={() => setSelectedType('object')} />
        </div>
        
        <div className="flex items-center gap-2 border-l border-slate-200 pl-4 ml-4">
          <ViewButton active={viewMode === 'grid'} icon={<Layers size={18} />} onClick={() => setViewMode('grid')} />
          <ViewButton active={viewMode === 'graph'} icon={<Network size={18} />} onClick={() => setViewMode('graph')} />
        </div>
      </div>

      {/* Knowledge Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              layout
            >
              <KnowledgeCard item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
            <Search size={40} />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900">Không tìm thấy kết quả</h3>
            <p className="text-slate-500 text-sm">Thử thay đổi từ khóa hoặc bộ lọc của bạn.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const MemoryStat: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
      {icon}
      {label}
    </div>
    <div className="text-lg font-black">{value}</div>
  </div>
);

const PreferenceTag: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    <span className="text-xs font-bold text-slate-700">{value}</span>
  </div>
);

const FilterTab: React.FC<{ active: boolean, label: string, onClick: () => void }> = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
      active 
        ? 'bg-slate-900 text-white shadow-md' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
    }`}
  >
    {label}
  </button>
);

const ViewButton: React.FC<{ active: boolean, icon: React.ReactNode, onClick: () => void }> = ({ active, icon, onClick }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-xl transition-all ${
      active 
        ? 'bg-slate-900 text-white shadow-md' 
        : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
    }`}
  >
    {icon}
  </button>
);

const KnowledgeCard: React.FC<{ item: IKnowledgeItem }> = ({ item }) => {
  const typeIcon = {
    person: <Users size={16} />,
    place: <MapPin size={16} />,
    event: <Clock size={16} />,
    object: <Layers size={16} />,
    concept: <Sparkles size={16} />,
    general: <Database size={16} />,
  }[item.type];

  const typeColor = {
    person: 'bg-blue-100 text-blue-600',
    place: 'bg-emerald-100 text-emerald-600',
    event: 'bg-amber-100 text-amber-600',
    object: 'bg-purple-100 text-purple-600',
    concept: 'bg-rose-100 text-rose-600',
    general: 'bg-slate-100 text-slate-600',
  }[item.type];

  return (
    <div className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${typeColor}`}>
          {typeIcon}
        </div>
        <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="space-y-2 flex-grow">
        <div className="flex items-center gap-2">
          <h3 className="font-black text-slate-900 text-lg group-hover:text-rose-600 transition-colors">{item.title}</h3>
          {item.aiNotes && item.aiNotes.length > 0 && (
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="AI has insights" />
          )}
        </div>
        <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {/* Relationships Preview */}
        <div className="flex flex-wrap gap-1.5">
          {item.relationships && item.relationships.length > 0 ? (
            item.relationships.slice(0, 3).map(rel => (
              <div key={rel.id} className="flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold text-slate-500">
                <Network size={10} />
                {rel.relationType}
              </div>
            ))
          ) : (
            <div className="text-[10px] text-slate-400 italic">Chưa có liên kết...</div>
          )}
          {item.relationships && item.relationships.length > 3 && (
            <div className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold text-slate-400">
              +{item.relationships.length - 3}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
              Updated {new Date(item.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <button className="flex items-center gap-1.5 text-slate-900 font-black uppercase tracking-widest text-[10px] hover:text-rose-600 transition-colors">
            Chi tiết
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
