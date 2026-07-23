import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  Command as CommandIcon, 
  History, 
  Star, 
  Clock, 
  Filter, 
  ArrowRight,
  ChevronRight,
  Zap,
  Map,
  Heart,
  PenTool,
  Calendar,
  Image as ImageIcon,
  MoreVertical,
  ChevronDown,
  Sparkles,
  Link2
} from 'lucide-react';
import { searchEngine } from '../../modules/search/SearchService';
import { ISearchResult, ISearchHistory, ISavedSearch, SearchResultType } from '../../modules/search/SearchTypes';

interface UniversalSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (result: ISearchResult) => void;
}

export const UniversalSearchOverlay: React.FC<UniversalSearchOverlayProps> = ({ isOpen, onClose, onSelectResult }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ISearchResult[]>([]);
  const [history, setHistory] = useState<ISearchHistory[]>(searchEngine.getSearchHistory());
  const [saved, setSaved] = useState<ISavedSearch[]>(searchEngine.getSavedSearches());
  const [activeFilter, setActiveFilter] = useState<SearchResultType | 'all'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
      setHistory(searchEngine.getSearchHistory());
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  useEffect(() => {
    const performSearch = async () => {
      if (query.trim().length >= 2) {
        setIsSearching(true);
        const res = await searchEngine.search(query, activeFilter !== 'all' ? { types: [activeFilter] } : undefined);
        setResults(res);
        setSelectedIndex(0);
        setIsSearching(false);
      } else {
        setResults([]);
      }
    };

    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [query, activeFilter]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % (results.length || 1));
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + (results.length || 1)) % (results.length || 1));
    } else if (e.key === 'Enter') {
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      } else if (query) {
        searchEngine.saveToHistory(query);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelect = (result: ISearchResult) => {
    searchEngine.saveToHistory(query);
    onSelectResult(result);
    onClose();
  };

  if (!isOpen) return null;

  const groupedResults = results.reduce((acc, curr) => {
    if (!acc[curr.type]) acc[curr.type] = [];
    acc[curr.type].push(curr);
    return acc;
  }, {} as Record<string, ISearchResult[]>);

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[10vh] px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="w-full max-w-3xl bg-white rounded-[40px] shadow-2xl border border-white/20 overflow-hidden relative z-10 flex flex-col max-h-[80vh]"
      >
        {/* Search Header */}
        <div className="px-8 pt-8 pb-6 border-b border-slate-100 space-y-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${isSearching ? 'bg-slate-900 text-white animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
              <Search size={24} />
            </div>
            <input 
              ref={inputRef}
              type="text"
              placeholder="Tìm kiếm ký ức, dự án hoặc nội dung..."
              className="flex-1 bg-transparent border-none focus:outline-none text-2xl font-black text-slate-900 placeholder:text-slate-200"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            <FilterChip 
              label="Tất cả" 
              active={activeFilter === 'all'} 
              onClick={() => setActiveFilter('all')} 
            />
            <FilterChip 
              label="Dự án" 
              active={activeFilter === 'project'} 
              onClick={() => setActiveFilter('project')} 
            />
            <FilterChip 
              label="Ký ức" 
              active={activeFilter === 'memory'} 
              onClick={() => setActiveFilter('memory')} 
            />
            <FilterChip 
              label="Hình ảnh" 
              active={activeFilter === 'asset'} 
              onClick={() => setActiveFilter('asset')} 
            />
            <FilterChip 
              label="Nháp" 
              active={activeFilter === 'draft'} 
              onClick={() => setActiveFilter('draft')} 
            />
          </div>
        </div>

        {/* Search Results Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {!query ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* History Section */}
              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <History size={12} /> Lịch sử tìm kiếm
                </h4>
                <div className="space-y-1">
                  {history.map(h => (
                    <button 
                      key={h.id}
                      onClick={() => setQuery(h.query)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 text-slate-600 group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Clock size={16} className="text-slate-300" />
                        <span className="text-sm font-bold">{h.query}</span>
                      </div>
                      <X size={14} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500" />
                    </button>
                  ))}
                  {history.length === 0 && <p className="text-xs text-slate-400 px-3">Chưa có lịch sử.</p>}
                </div>
              </section>

              {/* Saved Search Section */}
              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Star size={12} /> Đã lưu
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {saved.map(s => (
                    <button 
                      key={s.id}
                      onClick={() => setQuery(s.query)}
                      className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all text-slate-900 border border-transparent hover:border-slate-200"
                    >
                      <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                        <Zap size={16} />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-black">{s.label}</div>
                        <div className="text-[10px] text-slate-400 font-medium">"{s.query}"</div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-10">
              {Object.entries(groupedResults).map(([type, items]) => {
                const resultsItems = items as ISearchResult[];
                return (
                  <section key={type} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        {type === 'project' ? 'Dự án' : type === 'memory' ? 'Ký ức' : type === 'asset' ? 'Hình ảnh' : type === 'draft' ? 'Bản nháp' : type} ({resultsItems.length})
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {resultsItems.map((item) => (
                        <ResultItem 
                          key={item.id} 
                          item={item} 
                          isSelected={results[selectedIndex]?.id === item.id}
                          onClick={() => handleSelect(item)}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}

              {/* Related/AI Suggestions */}
              <section className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                  <Sparkles size={120} />
                </div>
                <div className="relative z-10 space-y-4">
                  <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Sparkles size={12} /> AI Insight Discovery
                  </h4>
                  <p className="text-sm font-medium text-white/80 max-w-lg">
                    Dựa trên tìm kiếm của bạn, có thể bạn đang quan tâm đến các mối liên hệ giữa <b>{query}</b> và <b>Dự án Đà Lạt</b>.
                  </p>
                  <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-rose-400 hover:text-rose-300 transition-colors">
                    Khám phá mối liên hệ <ArrowRight size={14} />
                  </button>
                </div>
              </section>
            </div>
          ) : !isSearching && (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Search size={40} />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-slate-900 text-xl">Không tìm thấy kết quả</h4>
                <p className="text-sm text-slate-400 font-medium">Thử tìm kiếm với mô tả tự nhiên hơn.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-4">
                <SuggestionTag label="Chuyến đi tháng 5" onClick={() => setQuery('Tháng 5')} />
                <SuggestionTag label="Kỷ niệm tại Đà Lạt" onClick={() => setQuery('Đà Lạt')} />
                <SuggestionTag label="Ảnh có hoa" onClick={() => setQuery('Hoa')} />
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Shortcut label="Esc" action="Thoát" />
            <Shortcut label="↵" action="Mở kết quả" />
            <Shortcut label="↑↓" action="Điều hướng" />
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
            <Sparkles size={12} className="text-rose-500" /> 
            Powered by Semantic Search Engine
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const FilterChip: React.FC<{ label: string, active: boolean, onClick: () => void }> = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
      active 
        ? 'bg-slate-900 text-white shadow-lg' 
        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
    }`}
  >
    {label}
  </button>
);

const ResultItem: React.FC<{ item: ISearchResult, isSelected: boolean, onClick: () => void }> = ({ item, isSelected, onClick }) => {
  const Icon = {
    project: Map,
    memory: Heart,
    asset: ImageIcon,
    draft: PenTool,
    timeline: Calendar,
    ai_note: Sparkles,
    person: Zap,
    place: Map,
    workflow: Zap,
    export: Zap
  }[item.type] || Search;

  return (
    <button 
      onClick={onClick}
      className={`w-full group flex items-start gap-4 p-4 rounded-3xl transition-all border ${
        isSelected 
          ? 'bg-white border-slate-900 shadow-xl scale-[1.02]' 
          : 'bg-white border-slate-100 hover:bg-slate-50'
      }`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-3 ${
        isSelected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
      }`}>
        <Icon size={24} />
      </div>
      <div className="flex-1 text-left">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h5 className="font-black text-slate-900 leading-tight">{item.title}</h5>
            {item.metadata?.tags?.map(t => (
              <span key={t} className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded-md">
                {t}
              </span>
            ))}
          </div>
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{item.metadata?.date}</span>
        </div>
        <p className="text-[11px] font-medium text-slate-400 line-clamp-1 mb-2">
          {item.subtitle || item.snippet}
        </p>
        <div className="flex items-center gap-4">
           {item.relatedIds && (
             <div className="flex items-center gap-1 text-[9px] font-black text-rose-500 uppercase tracking-widest">
               <Link2 size={10} /> 3 liên kết
             </div>
           )}
           {item.metadata?.location && (
             <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
               <Map size={10} /> {item.metadata.location}
             </div>
           )}
        </div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight size={18} className="text-slate-300" />
      </div>
    </button>
  );
};

const SuggestionTag: React.FC<{ label: string, onClick: () => void }> = ({ label, onClick }) => (
  <button 
    onClick={onClick}
    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all"
  >
    {label}
  </button>
);

const Shortcut: React.FC<{ label: string, action: string }> = ({ label, action }) => (
  <div className="flex items-center gap-1.5">
    <div className="min-w-[24px] h-6 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm px-1.5 text-[10px] font-black text-slate-900">
      {label}
    </div>
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{action}</span>
  </div>
);
